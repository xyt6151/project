import { NextPage } from 'next';
import { useState, useContext, useEffect } from 'react';
import { CredentialContext } from './_app';
import { getRequiredCredentialLevel } from '../lib/credentialMappings';
import CommandPalette from '../components/CommandPalette';
import UserCombobox from '../components/UserCombobox';
import CollapsibleSection from '../components/CollapsibleSection';
import { sections } from '../config/sections';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Home: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { credentialLevel } = useContext(CredentialContext);

  useEffect(() => {
    if (credentialLevel !== 'anonymous') {
      setIsLoading(false);
    } else {
      // Reset active section when user logs out
      setActiveIndex(null);
      setIsLoading(false);
    }
  }, [credentialLevel]);

  const handleToggle = (index: number) => {
    // Check if user has required credentials for this section
    const section = sections[index];
    const requiredLevel = getRequiredCredentialLevel(section.id);
    const userLevel = getRequiredCredentialLevel(credentialLevel);
    
    if (userLevel < requiredLevel) {
      console.warn('Insufficient credentials for this section');
      return;
    }

    // Toggle section: close if clicking active section, otherwise open clicked section
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="fixed top-4 left-0 right-0 flex justify-between items-center px-4 z-50">
        <div className="w-96 invisible">
          {/* Spacer for centering */}
        </div>
        <CommandPalette />
        <UserCombobox />
      </div>
      <main className="h-full pt-20 px-4 relative">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="text-[20rem] font-bold text-gray-100 transform -rotate-45 select-none">
            MORGAN
          </div>
        </div>
        {/* Sections Container */}
        <div className="relative h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : credentialLevel !== 'anonymous' ? (
            <div className="relative">
              {sections.map((section, index) => (
                <ErrorBoundary key={section.id}>
                  <CollapsibleSection
                    title={section.title}
                    isOpen={activeIndex === index}
                    onToggle={() => handleToggle(index)}
                    index={index}
                    activeIndex={activeIndex}
                  >
                    <div className="text-gray-600 h-full">
                      {section.content}
                    </div>
                  </CollapsibleSection>
                </ErrorBoundary>
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Home;