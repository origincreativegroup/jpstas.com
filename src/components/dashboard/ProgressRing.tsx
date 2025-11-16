import { component$, useSignal } from '@builder.io/qwik';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export const ProgressRing = component$<ProgressRingProps>(({ 
  percentage, 
  size = 60, 
  strokeWidth = 4,
  color = '#b98f45',
  className = '',
  animated = true
}) => {
  const circleRef = useSignal<SVGCircleElement>();
  const textRef = useSignal<SVGTextElement>();
  const hasAnimated = useSignal(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Simple animation state
  hasAnimated.value = true;

  return (
    <div class={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        class="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          stroke-width={strokeWidth}
          fill="none"
          class="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          stroke-width={strokeWidth}
          fill="none"
          stroke-dasharray={strokeDasharray}
          stroke-dashoffset={strokeDashoffset}
          stroke-linecap="round"
          class={`transition-all duration-1000 ${animated ? 'animate-pulse' : ''}`}
        />
        {/* Percentage text */}
        <text
          ref={textRef}
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-sm font-bold fill-current"
          style={{ color }}
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
});
