package ssdp

import (
	"context"
	"fmt"
	"net"
	"strings"
	"time"

	"github.com/fastenhealth/fasten-onprem/backend/pkg/config"
	"github.com/sirupsen/logrus"
)

const (
	// SSDP standard constants
	SSDP_ADDR     = "239.255.255.250:1900" // Standard SSDP multicast address
	SSDP_PORT     = 1900                    // Standard SSDP port
	SSDP_MAX_AGE  = 1800                    // Max age for SSDP responses (30 minutes)
	SSDP_INTERVAL = 30                      // Interval for periodic NOTIFY (30 seconds)
)

type SSDPService struct {
	config     config.Interface
	logger     *logrus.Entry
	serverAddr string
	serverPort string
	ctx        context.Context
	cancel     context.CancelFunc
	conn       *net.UDPConn
}

func NewSSDPService(config config.Interface, logger *logrus.Entry, serverAddr, serverPort string) *SSDPService {
	ctx, cancel := context.WithCancel(context.Background())
	return &SSDPService{
		config:     config,
		logger:     logger,
		serverAddr: serverAddr,
		serverPort: serverPort,
		ctx:        ctx,
		cancel:     cancel,
	}
}

func (s *SSDPService) Start() error {
	s.logger.Info("Starting SSDP service for UPnP device discovery")

	// Create UDP connection for SSDP multicast
	ssdpAddr, err := net.ResolveUDPAddr("udp", SSDP_ADDR)
	if err != nil {
		return fmt.Errorf("failed to resolve SSDP address: %v", err)
	}

	// Try to bind to the multicast address directly
	conn, err := net.ListenMulticastUDP("udp", nil, ssdpAddr)
	if err != nil {
		s.logger.Warnf("Failed to bind to multicast address %s: %v", SSDP_ADDR, err)
		
		// Fallback: bind to any available port
		addr, err := net.ResolveUDPAddr("udp", ":0")
		if err != nil {
			return fmt.Errorf("failed to resolve UDP address: %v", err)
		}

		conn, err = net.ListenUDP("udp", addr)
		if err != nil {
			return fmt.Errorf("failed to create UDP connection: %v", err)
		}
	}

	s.conn = conn
	s.logger.Infof("SSDP service bound to %s", conn.LocalAddr().String())

	// Start goroutine to handle incoming SSDP messages
	go s.handleSSDPMessages()

	// Start periodic NOTIFY broadcasts
	go s.broadcastPresence()

	s.logger.Info("SSDP service started successfully")
	return nil
}



func (s *SSDPService) Stop() {
	s.logger.Info("Stopping SSDP service")
	if s.cancel != nil {
		s.cancel()
	}
	if s.conn != nil {
		s.conn.Close()
	}
}

func (s *SSDPService) handleSSDPMessages() {
	buffer := make([]byte, 1024)
	
	for {
		select {
		case <-s.ctx.Done():
			return
		default:
			// Set read timeout to allow context cancellation
			s.conn.SetReadDeadline(time.Now().Add(1 * time.Second))
			
			n, remoteAddr, err := s.conn.ReadFromUDP(buffer)
			if err != nil {
				if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
					continue // Timeout, continue loop
				}
				if strings.Contains(err.Error(), "use of closed network connection") {
					return // Connection closed
				}
				s.logger.Debugf("UDP read error: %v", err)
				continue
			}

			message := string(buffer[:n])
			s.logger.Debugf("Received SSDP message from %s: %s", remoteAddr, message)

			// Handle M-SEARCH requests
			if strings.Contains(message, "M-SEARCH") {
				go s.handleMSearch(remoteAddr, message)
			}
		}
	}
}

func (s *SSDPService) handleMSearch(remoteAddr *net.UDPAddr, message string) {
	s.logger.Infof("Handling M-SEARCH request from %s", remoteAddr)

	// Parse M-SEARCH request to get search target
	searchTarget := s.extractSearchTarget(message)
	
	// Check if we support the requested service
	if searchTarget == "ssdp:all" || 
	   strings.Contains(searchTarget, "FastenHealth") ||
	   strings.Contains(searchTarget, "upnp:rootdevice") {
		
		// Send SSDP response
		response := s.createSSDPResponse(searchTarget)
		s.sendSSDPResponse(remoteAddr, response)
	}
}

func (s *SSDPService) extractSearchTarget(message string) string {
	lines := strings.Split(message, "\r\n")
	for _, line := range lines {
		if strings.HasPrefix(line, "ST:") {
			return strings.TrimSpace(strings.TrimPrefix(line, "ST:"))
		}
	}
	return "ssdp:all"
}

func (s *SSDPService) createSSDPResponse(searchTarget string) string {
	// Get server host (prefer X-Forwarded-Host if available)
	serverHost := s.serverAddr
	if serverHost == "0.0.0.0" {
		serverHost = "localhost" // Fallback for local development
	}

	location := fmt.Sprintf("http://%s:%s%s", serverHost, s.serverPort, s.config.GetString("ssdp.location"))
	
	response := fmt.Sprintf(
		"HTTP/1.1 200 OK\r\n"+
			"CACHE-CONTROL: max-age=%d\r\n"+
			"DATE: %s\r\n"+
			"EXT:\r\n"+
			"LOCATION: %s\r\n"+
			"SERVER: FastenHealth/1.0 UPnP/1.0\r\n"+
			"ST: %s\r\n"+
			"USN: uuid:fasten-onprem-%s::%s\r\n"+
			"\r\n",
		SSDP_MAX_AGE,
		time.Now().Format(time.RFC1123),
		location,
		searchTarget,
		s.config.GetString("ssdp.name"),
		searchTarget,
	)
	
	return response
}

func (s *SSDPService) sendSSDPResponse(remoteAddr *net.UDPAddr, response string) {
	// Send response to the requesting client
	_, err := s.conn.WriteToUDP([]byte(response), remoteAddr)
	if err != nil {
		s.logger.Errorf("Failed to send SSDP response: %v", err)
	} else {
		s.logger.Infof("Sent SSDP response to %s", remoteAddr)
	}
}

func (s *SSDPService) broadcastPresence() {
	// Wait for service to fully start
	time.Sleep(2 * time.Second)
	
	s.logger.Info("Starting periodic SSDP presence broadcasts")
	
	ticker := time.NewTicker(SSDP_INTERVAL * time.Second)
	defer ticker.Stop()
	
	// Send initial NOTIFY
	s.sendNotify()
	
	for {
		select {
		case <-s.ctx.Done():
			return
		case <-ticker.C:
			s.sendNotify()
		}
	}
}

func (s *SSDPService) sendNotify() {
	// Get server host
	serverHost := s.serverAddr
	if serverHost == "0.0.0.0" {
		serverHost = "localhost"
	}

	location := fmt.Sprintf("http://%s:%s%s", serverHost, s.serverPort, s.config.GetString("ssdp.location"))
	
	// Create NOTIFY message
	notify := fmt.Sprintf(
		"NOTIFY * HTTP/1.1\r\n"+
			"HOST: %s\r\n"+
			"CACHE-CONTROL: max-age=%d\r\n"+
			"LOCATION: %s\r\n"+
			"NT: %s\r\n"+
			"NTS: ssdp:alive\r\n"+
			"SERVER: FastenHealth/1.0 UPnP/1.0\r\n"+
			"USN: uuid:fasten-onprem-%s::%s\r\n"+
			"\r\n",
		SSDP_ADDR,
		SSDP_MAX_AGE,
		location,
		s.config.GetString("ssdp.service"),
		s.config.GetString("ssdp.name"),
		s.config.GetString("ssdp.service"),
	)
	
	// Send to SSDP multicast address
	ssdpAddr, err := net.ResolveUDPAddr("udp", SSDP_ADDR)
	if err != nil {
		s.logger.Errorf("Failed to resolve SSDP address: %v", err)
		return
	}
	
	_, err = s.conn.WriteToUDP([]byte(notify), ssdpAddr)
	if err != nil {
		s.logger.Errorf("Failed to send SSDP NOTIFY: %v", err)
	} else {
		s.logger.Debug("Sent SSDP NOTIFY broadcast")
	}
}
