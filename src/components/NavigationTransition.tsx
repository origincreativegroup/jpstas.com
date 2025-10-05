import { ReactNode, useTransition, createContext, useContext } from 'react';

interface NavigationTransitionContextType {
  isPending: boolean;
  startNavigationTransition: (callback: () => void) => void;
}

const NavigationTransitionContext = createContext<NavigationTransitionContextType | undefined>(
  undefined
);

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);
  if (!context) {
    throw new Error('useNavigationTransition must be used within NavigationTransitionProvider');
  }
  return context;
}

interface NavigationTransitionProviderProps {
  children: ReactNode;
}

/**
 * Provides navigation transition state using React 18's useTransition
 * Enables smooth, non-blocking route changes with visual feedback
 */
export function NavigationTransitionProvider({ children }: NavigationTransitionProviderProps) {
  const [isPending, startTransition] = useTransition();

  const startNavigationTransition = (callback: () => void) => {
    startTransition(() => {
      callback();
    });
  };

  return (
    <NavigationTransitionContext.Provider value={{ isPending, startNavigationTransition }}>
      {children}
      {/* Navigation loading indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-accent via-purple-500 to-accent animate-shimmer">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide" />
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-slide {
          animation: slide 1s ease-in-out infinite;
        }
      `}</style>
    </NavigationTransitionContext.Provider>
  );
}
