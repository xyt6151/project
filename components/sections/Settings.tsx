import { useState } from 'react';
import { UserIcon, CogIcon, UsersIcon, ChatBubbleLeftRightIcon, KeyboardIcon } from '@heroicons/react/24/solid';
import { SettingsSection } from '../ui/SettingsSection';
import { PersonalSettings } from '../settings/PersonalSettings';
import { ApiSettings } from '../settings/ApiSettings';
import { UserManagement } from '../settings/UserManagement';
import { ConversationSettings } from '../settings/ConversationSettings';
import { InputSettings } from '../settings/InputSettings';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  isOpen: boolean;
  component: React.ComponentType;
}

export default function Settings() {
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Personal Settings', icon: UserIcon, isOpen: false, component: PersonalSettings },
    { id: 'api', title: 'API/Webhook Settings', icon: CogIcon, isOpen: false, component: ApiSettings },
    { id: 'users', title: 'User Management', icon: UsersIcon, isOpen: false, component: UserManagement },
    { id: 'conversation', title: 'Conversation Settings', icon: ChatBubbleLeftRightIcon, isOpen: false, component: ConversationSettings },
    { id: 'input', title: 'User Input Methods', icon: KeyboardIcon, isOpen: false, component: InputSettings }
  ]);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      isOpen: section.id === id ? !section.isOpen : section.isOpen
    })));
  };

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <SettingsSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          isOpen={section.isOpen}
          onToggle={() => toggleSection(section.id)}
        >
          <section.component />
        </SettingsSection>
      ))}
    </div>
  );
}