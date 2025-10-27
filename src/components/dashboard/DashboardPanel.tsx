import { component$, useSignal } from '@builder.io/qwik';

interface DashboardPanelProps {
  title: string;
  children?: any;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const DashboardPanel = component$<DashboardPanelProps>(({ 
  title, 
  children, 
  collapsible = true,
  defaultExpanded = true
}) => {
  const isExpanded = useSignal(defaultExpanded);
  const contentRef = useSignal<HTMLElement>();
  const chevronRef = useSignal<HTMLElement>();

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  return (
    <div class="dashboard-panel rounded-2xl glass p-6">
      <div 
        class="flex items-center justify-between mb-4 cursor-pointer"
        onClick$={collapsible ? toggleExpanded : undefined}
      >
        <h3 class="text-xl font-bold text-text-primary">{title}</h3>
        {collapsible && (
          <div 
            ref={chevronRef}
            class={`transition-transform duration-300 ${isExpanded.value ? 'rotate-180' : 'rotate-0'}`}
          >
            <svg 
              class="w-5 h-5 text-text-secondary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
      <div 
        ref={contentRef}
        class={`overflow-hidden transition-all duration-300 ${isExpanded.value ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
});
