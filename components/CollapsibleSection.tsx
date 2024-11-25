import { ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  index: number;
  activeIndex: number | null;
}

export default function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  index,
  activeIndex
}: CollapsibleSectionProps) {
  const isHidden = activeIndex !== null && activeIndex !== index;
  const isActive = activeIndex === index;
  
  return (
    <div 
      className={clsx(
        'rounded-lg bg-white shadow-md overflow-hidden',
        'transition-all duration-500 ease-in-out',
        isActive ? 'fixed-section' : 'collapsed-section',
        isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      style={{
        position: isActive ? 'fixed' : 'relative',
        top: isActive ? '80px' : `${index * (isHidden ? 0 : 56)}px`,
        left: isActive ? '16px' : '0',
        right: isActive ? '16px' : '0',
        transform: isHidden ? 'translateY(100vh)' : 'translateY(0)',
        transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: isHidden ? `${index * 100}ms` : '0ms',
        zIndex: isActive ? 20 : 10,
        height: isActive ? 'calc(100vh - 96px)' : '52px',
        marginBottom: isActive ? 0 : '8px'
      }}
    >
      <div className="flex h-full">
        <div 
          className={clsx(
            'w-12 transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer',
            isOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          )}
          onClick={onToggle}
        >
          {isOpen && (
            <ChevronLeftIcon 
              className="h-6 w-6 text-white transform transition-transform duration-300 hover:scale-110"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1 p-3 overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div 
            className={clsx(
              'transition-all duration-500 ease-in-out overflow-auto custom-scrollbar',
              isOpen ? 'opacity-100 mt-4 flex-1' : 'opacity-0 h-0'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}