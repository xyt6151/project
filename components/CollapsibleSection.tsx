import { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

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
        position: isActive ? 'absolute' : 'relative',
        top: isActive ? 0 : `${index * (isHidden ? 0 : 56)}px`,
        left: 0,
        right: 0,
        transform: isHidden ? 'translateY(100vh)' : 'translateY(0)',
        transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: isHidden ? `${index * 100}ms` : '0ms',
        zIndex: isActive ? 20 : 10,
        height: isActive ? '400px' : '52px',
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
            <ArrowLeftIcon 
              className="h-6 w-6 text-white transform transition-transform duration-300 hover:scale-110"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div 
            className={clsx(
              'transition-all duration-500 ease-in-out overflow-hidden',
              isOpen ? 'opacity-100 mt-4' : 'opacity-0 h-0'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}