import SystemChat from '../components/sections/SystemChat';
import ApiKeys from '../components/sections/ApiKeys';
import Settings from '../components/settings/Settings';
import Placeholder from '../components/sections/Placeholder';

export const sections = [
  { id: 'chat', title: 'Chat with System', content: <SystemChat />, requiredLevel: 'user' },
  { id: 'api', title: 'API', content: <ApiKeys />, requiredLevel: 'privileged' },
  { id: 'logviewer', title: 'Logs', content: <Placeholder />, requiredLevel: 'privileged' },
  { id: 'db', title: 'Database', content: <Placeholder />, requiredLevel: 'privileged' },
  { id: 'knowledge', title: 'Manage Knowledge Base', content: <Placeholder />, requiredLevel: 'privileged' },
  { id: 'settings', title: 'Settings', content: <Settings />, requiredLevel: 'user' },
]; 