const STORAGE_KEYS = {
  FORM_DATA: 'form_data',
};

export const FORM_TYPES = {
  ENCOUNTER: 'encounter',
  MEDICATION: 'medication',
  PROCEDURE: 'procedure',
  PRACTITIONER: 'practitioner',
  ORGANIZATION: 'organization',
  LAB_RESULT: 'lab_result',
};

export const saveFormSection = (formType: string, data: any) => {
  const existing = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.FORM_DATA) || '{}'
  );
  const updated = {
    ...existing,
    [formType]: data,
  };
  localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(updated));
};

export const getFormSection = (formType: string): any => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.FORM_DATA) || '{}');
  return data[formType] || null;
};

export const clearFormData = () => {
  localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
};
