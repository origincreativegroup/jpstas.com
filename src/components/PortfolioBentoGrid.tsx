import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/project';
import PortfolioCard from './PortfolioCard';
import { generateBentoLayout } from '@/utils/bentoLayout';

interface PortfolioBentoGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  filterKey: string; // Used to trigger re-animation on filter change
}

export default function PortfolioBentoGrid({
  projects,
  onProjectClick,
  filterKey
}: PortfolioBentoGridProps) {
  // Generate smart layout
  const layoutItems = generateBentoLayout(projects);

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100"
      >
        <svg
          className="w-20 h-20 text-neutral-300 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-2xl font-bold text-neutral-700 mb-2">No projects found</h3>
        <p className="text-neutral-500 text-lg">Try selecting a different category</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filterKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr"
      >
        {layoutItems.map((item, index) => (
          <PortfolioCard
            key={item.project.id}
            project={item.project}
            size={item.size}
            index={index}
            onProjectClick={onProjectClick}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
