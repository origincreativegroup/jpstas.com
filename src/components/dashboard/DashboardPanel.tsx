import { component$, useSignal, $, useComputed$, Slot } from '@builder.io/qwik';

interface DashboardPanelProps {
  title: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const DashboardPanel = component$<DashboardPanelProps>(({ 
  title, 
  collapsible = true,
  defaultExpanded = true
}) => {
  const isExpanded = useSignal(defaultExpanded);

  const toggleExpanded = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  const contentClass = useComputed$(() => {
    const base = 'overflow-hidden transition-all duration-300 ease-in-out';
    if (isExpanded.value) {
      return `${base} opacity-100`;
    }
    return `${base} opacity-0 max-h-0`;
  });

  const contentStyle = useComputed$(() => {
    if (isExpanded.value) {
      return `max-height: 5000px;`;
    }
    return `max-height: 0px;`;
  });

  const chevronClass = useComputed$(() => {
    return isExpanded.value 
      ? 'transition-transform duration-300 rotate-180'
      : 'transition-transform duration-300 rotate-0';
  });

  return (
    <div class="dashboard-panel rounded-2xl glass p-6 border border-cream/10">
      <div 
        class={`flex items-center justify-between ${collapsible ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity mb-4`}
        onClick$={collapsible ? toggleExpanded : undefined}
      >
        <h3 class="text-xl font-bold text-cream">{title}</h3>
        {collapsible && (
          <div class={chevronClass.value}>
            <svg 
              class="w-5 h-5 text-sand" 
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
        class={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded.value 
            ? 'max-h-[5000px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div>
          <Slot />
        </div>
      </div>
    </div>
  );
});
