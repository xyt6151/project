import { useState, useContext } from 'react';
import { UserIcon, Cog6ToothIcon as CogIcon, UsersIcon, ChatBubbleLeftRightIcon, CommandLineIcon } from '@heroicons/react/24/solid';
import SettingsSection from '../ui/SettingsSection';
import PersonalSettings from './PersonalSettings';
import ApiSettings from './ApiSettings';
import UserManagement from './UserManagement';
import ConversationSettings from './ConversationSettings';
import InputSettings from './InputSettings';
import { CredentialContext } from '../../pages/_app';
import { getRequiredCredentialLevel } from '../../lib/credentialMappings';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  isOpen: boolean;
  component: React.ComponentType;
  requiredLevel: string;
}

export default function Settings() {
  const { credentialLevel } = useContext(CredentialContext);
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Personal Settings', icon: UserIcon, isOpen: false, component: PersonalSettings, requiredLevel: 'user' },
    { id: 'api', title: 'API/Webhook Settings', icon: CogIcon, isOpen: false, component: ApiSettings, requiredLevel: 'privileged' },
    { id: 'users', title: 'User Management', icon: UsersIcon, isOpen: false, component: UserManagement, requiredLevel: 'privileged' },
    { id: 'conversation', title: 'Conversation Settings', icon: ChatBubbleLeftRightIcon, isOpen: false, component: ConversationSettings, requiredLevel: 'privileged' },
    { id: 'input', title: 'User Input Methods', icon: CommandLineIcon, isOpen: false, component: InputSettings, requiredLevel: 'user' }
  ]);

  const filteredSections = sections.filter(section => 
    getRequiredCredentialLevel(section.id) <= getRequiredCredentialLevel(credentialLevel)
  );

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      isOpen: section.id === id ? !section.isOpen : section.isOpen
    })));
  };

  return (
    <div className="space-y-4">
      {filteredSections.map(section => {
        const Component = section.component;
        return (
          <SettingsSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            isOpen={section.isOpen}
            onToggle={() => toggleSection(section.id)}
          >
            <Component />
          </SettingsSection>
        );
      })}
    </div>
  );
}