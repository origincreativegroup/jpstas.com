import homeRaw from '~/content/home.json';

export type MediaAsset = {
  type?: 'image' | 'video' | 'gif';
  src: string;
  alt: string;
  poster?: string;
};

export type ProjectSummary = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags?: string[];
  hero: MediaAsset;
  thumbnail: MediaAsset;
  accent?: string;
};

type RawHeroSlide = {
  slug: string;
  headline: string;
  category: string;
  description: string;
  media: MediaAsset;
};

export type BentoLayout = {
  md: { colSpan: number; rowSpan: number };
  xl: { colSpan: number; rowSpan: number };
};

type RawBentoItem = {
  slug: string;
  layout: BentoLayout;
};

type RawHomeContent = {
  hero: { slides: RawHeroSlide[] };
  bento: {
    items: RawBentoItem[];
    cta: { label: string; href: string };
  };
  metrics: MetricBlock[];
};

export type HeroSlide = RawHeroSlide & {
  project: ProjectSummary;
};

export type BentoItem = RawBentoItem & {
  project: ProjectSummary;
};

export type MetricBlock = {
  title: string;
  items: string[];
};

const projectModules = import.meta.glob<ProjectSummary>('../content/projects/*.json', {
  eager: true,
  import: 'default',
});

const projectMap = Object.values(projectModules).reduce<Record<string, ProjectSummary>>(
  (acc, project) => {
    acc[project.slug] = project;
    return acc;
  },
  {},
);

export const getProjectSummary = (slug: string): ProjectSummary | undefined => projectMap[slug];

export const getAllProjectSummaries = (): ProjectSummary[] => Object.values(projectMap);

export const getHomeContent = () => {
  const homeContent = homeRaw as RawHomeContent;

  const hero: HeroSlide[] = homeContent.hero.slides
    .map((slide) => {
      const project = getProjectSummary(slide.slug);
      if (!project) return undefined;
      return {
        ...slide,
        project,
      } as HeroSlide;
    })
    .filter((slide): slide is HeroSlide => Boolean(slide));

  const bento: { items: BentoItem[]; cta: { label: string; href: string } } = {
    items: homeContent.bento.items
      .map((item) => {
        const project = getProjectSummary(item.slug);
        if (!project) return undefined;
        return {
          ...item,
          project,
        } as BentoItem;
      })
      .filter((item): item is BentoItem => Boolean(item)),
    cta: homeContent.bento.cta,
  };

  const metrics: MetricBlock[] = homeContent.metrics;

  return {
    hero,
    bento,
    metrics,
  };
};


