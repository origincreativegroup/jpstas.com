import { component$, useSignal } from '@builder.io/qwik';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export const SparklineChart = component$<SparklineChartProps>(({ 
  data, 
  width = 120, 
  height = 30,
  color = '#2E3192',
  className = '',
  animated = true
}) => {
  const pathRef = useSignal<SVGPathElement>();
  const hasAnimated = useSignal(false);

  // Normalize data to fit within the chart bounds
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const normalizedData = data.map(value => 
    ((value - min) / range) * (height - 4) + 2
  );

  // Create SVG path
  const createPath = () => {
    if (normalizedData.length < 2) return '';
    
    const stepX = width / (normalizedData.length - 1);
    let path = `M 0 ${height - normalizedData[0]}`;
    
    for (let i = 1; i < normalizedData.length; i++) {
      const x = i * stepX;
      const y = height - normalizedData[i];
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const pathData = createPath();

  // Simple animation state
  hasAnimated.value = true;

  return (
    <div class={`${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        class="overflow-visible"
      >
        <path
          ref={pathRef}
          d={pathData}
          stroke={color}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class={`transition-all duration-1000 ${animated ? 'animate-pulse' : ''}`}
        />
        {/* Data points */}
        {normalizedData.map((value, index) => {
          const x = (index / (normalizedData.length - 1)) * width;
          const y = height - value;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              class="opacity-60"
            />
          );
        })}
      </svg>
    </div>
  );
});
