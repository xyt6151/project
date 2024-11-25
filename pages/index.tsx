import { NextPage } from 'next';
import { useState } from 'react';
import CommandPalette from '../components/CommandPalette';
import UserCombobox from '../components/UserCombobox';
import CollapsibleSection from '../components/CollapsibleSection';
import SystemChat from '../components/sections/SystemChat';
import ApiKeys from '../components/sections/ApiKeys';
import Settings from '../components/sections/Settings';
import Placeholder from '../components/sections/Placeholder';

// Note: to add - sections and the collapsible divs within should be able to be navigated to using a URL, 
// e.g. "https://example.com/chat" for "Chat with System", or:
// e.g. "https://example.com/db/security", for the "Security" div under the "Database" titled section
const sections = [
  { id: 'chat', title: 'Chat with System', content: <SystemChat /> }, // Contains just the chat UI
  // Note: Chat UI should include a button to open the Conversation Settings, from under "Settings" section
  // Note: LLM/System participant in chat should be labelled "Morgan"
  { id: 'api', title: 'API', content: <ApiKeys /> }, // Subpage containing API-related collapsibles
  // API subpage contains the following collapsible divs:
  // - Manage API Keys
  // - MORGAN API Info
  // - API Tester
  { id: 'logviewer', title: 'Logs', content: <Placeholder /> }, // Subpage for logs, metrics, etc collapsibles
  // Contains the following collapsibles:
  // - Log Viewer
  // - Visual Metrics
  { id: 'db', title: 'Database', content: <Placeholder /> }, // Contains collapsible divs related to managing DB, Tables, etc
  // Contains: 
  // - Manage Tables
  // - Database Users
  // - Security
    { id: 'knowledge', title: 'Manage Knowledge Base', content: <Placeholder /> }, // Contains collapsible divs related to uploading files, adding text, managing LLM memory, etc
  // Contains: 
  // - Files
  // - Plain Text
  // - Conversation History
  // - Other
  { id: 'settings', title: 'Settings', content: <Settings /> }, // Contains collapsible divs for aspects of system and user settings
  // Contains:
  // - Personal Settings
  // - API/Webhook Settings
  // - User Management
  // - Conversation Settings
  // - User Input Methods
];

const Home: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-4 left-0 right-0 flex justify-between items-center px-4 z-50">
        <div className="w-96 invisible">
          {/* Spacer for centering */}
        </div>
        <CommandPalette />
        <UserCombobox />
      </div>
      <main className="container mx-auto px-4 py-20">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="text-[20rem] font-bold text-gray-100 transform -rotate-45 select-none">
            MORGAN
          </div>
        </div>
        {/* Sections Container */}
        <div className="relative">
          <div className="relative min-h-[400px]">
            {sections.map((section, index) => (
              <CollapsibleSection
                key={section.id}
                title={section.title}
                isOpen={activeIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
                activeIndex={activeIndex}
              >
                <div className="text-gray-600">
                  {section.content}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;



