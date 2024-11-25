const CREDENTIAL_LEVELS = {
  anonymous: 0,
  user: 1,
  privileged: 2,
  admin: 3
};

const SECTION_REQUIREMENTS = {
  chat: 'user',
  api: 'privileged',
  logviewer: 'privileged',
  db: 'privileged',
  knowledge: 'privileged',
  settings: 'user',
  // Settings subsections
  personal: 'user',
  api_settings: 'privileged',
  users: 'privileged',
  conversation: 'privileged',
  input: 'user'
};

export const getRequiredCredentialLevel = (sectionId: string): number => {
  const requirement = SECTION_REQUIREMENTS[sectionId as keyof typeof SECTION_REQUIREMENTS] || 'anonymous';
  return CREDENTIAL_LEVELS[requirement as keyof typeof CREDENTIAL_LEVELS] || 0;
};

export const hasRequiredCredential = (userLevel: string, requiredLevel: string): boolean => {
  return CREDENTIAL_LEVELS[userLevel as keyof typeof CREDENTIAL_LEVELS] >= CREDENTIAL_LEVELS[requiredLevel as keyof typeof CREDENTIAL_LEVELS];
}; 