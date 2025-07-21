#!/bin/bash

# Detect the primary network IP address in a cross-platform way.
# This script will try various methods to find an IP address that is suitable for local network communication.

# Function to detect the IP address
detect_ip() {
    # Start with a default
    IP_ADDR="localhost"

    # For macOS, `ipconfig` is a good choice. We look for an active en0 or en1 interface.
    if [[ "$(uname)" == "Darwin" ]]; then
        IP_ADDR=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "localhost")
    # For Linux, the `ip` command is standard.
    elif [[ "$(uname)" == "Linux" ]]; then
        IP_ADDR=$(ip -4 addr show $(ip route | grep default | awk '{print $5}') | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
    fi

    # A fallback for other systems or if the above fails.
    if [[ "$IP_ADDR" == "localhost" || -z "$IP_ADDR" ]]; then
        # This is a more generic command that works on many systems.
        IP_ADDR=$(hostname -I | awk '{print $1}')
    fi

    # Final check to ensure we don't return an empty string.
    if [[ -z "$IP_ADDR" ]]; then
        IP_ADDR="localhost"
    fi

    echo "$IP_ADDR"
}

# Detect the IP and export it so docker-compose can use it.
export FASTEN_EXTERNAL_HOST=$(detect_ip)

echo "Starting Fasten with external IP: $FASTEN_EXTERNAL_HOST"

# Run docker-compose
docker-compose up
