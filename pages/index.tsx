import { NextPage } from 'next';
import { useState } from 'react';
import CommandPalette from '../components/CommandPalette';
import UserCombobox from '../components/UserCombobox';
import CollapsibleSection from '../components/CollapsibleSection';
import SystemChat from '../components/sections/SystemChat';
import ApiKeys from '../components/sections/ApiKeys';
import Settings from '../components/settings/Settings';
import Placeholder from '../components/sections/Placeholder';

const sections = [
  { id: 'chat', title: 'Chat with System', content: <SystemChat /> },
  { id: 'api', title: 'API', content: <ApiKeys /> },
  { id: 'logviewer', title: 'Logs', content: <Placeholder /> },
  { id: 'db', title: 'Database', content: <Placeholder /> },
  { id: 'knowledge', title: 'Manage Knowledge Base', content: <Placeholder /> },
  { id: 'settings', title: 'Settings', content: <Settings /> },
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