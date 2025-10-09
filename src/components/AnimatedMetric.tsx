import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface AnimatedMetricProps {
  value: string;
  label: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedMetric = component$<AnimatedMetricProps>(({ 
  value, 
  label, 
  suffix = '',
  duration = 2000 
}) => {
  const displayValue = useSignal('0');
  const hasAnimated = useSignal(false);

  useVisibleTask$(({ cleanup }) => {
    if (typeof window === 'undefined' || hasAnimated.value) return;

    // Extract numeric value from string
    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      displayValue.value = value;
      return;
    }

    const targetValue = parseFloat(numericMatch[0]);
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));
    const valueSuffix = value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length);
    
    const startTime = Date.now();
    const isDecimal = targetValue % 1 !== 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = targetValue * easeOut;
      
      displayValue.value = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + valueSuffix + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.value = true;
      }
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.value) {
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    
    const element = document.getElementById(`metric-${label.replace(/\s+/g, '-')}`);
    if (element) {
      observer.observe(element);
    }
    
    cleanup(() => {
      if (element) observer.unobserve(element);
    });
  });

  return (
    <div 
      id={`metric-${label.replace(/\s+/g, '-')}`}
      class="rounded-2xl bg-gradient-to-br from-white to-neutral/30 p-6 shadow-lg border border-neutral/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
    >
      <div class="text-3xl font-bold text-primary mb-2 md:text-4xl">
        {displayValue.value}
      </div>
      <div class="text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
});

