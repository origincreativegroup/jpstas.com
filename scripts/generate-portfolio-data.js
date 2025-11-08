import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORTFOLIO_MD_DIR = '/Users/origin/GitHub/jspow/jpstas_portfolio_assets_FINAL_with_portfolio/content/portfolio';
const ASSET_MANIFEST_PATH = '/Users/origin/GitHub/jspow/jpstas_portfolio_assets_FINAL_with_portfolio/assets/assets.manifest.json';
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data', 'portfolio');
const ASSET_BASE_URL = 'https://media.jpstas.com';

const STUDY_CONFIG = {
  'brand-evolution': { category: 'design', featured: true },
  'customer-experience-systems': { category: 'process', featured: true },
  'in-house-print-studio': { category: 'process', featured: true },
  'media-campaigns': { category: 'design', featured: false },
  'website-redesign': { category: 'development', featured: true },
};

function stripFormatting(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/#+\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+%/g, '%')
    .trim();
}

function splitList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => stripFormatting(item).trim())
    .filter(Boolean);
}

function loadManifest() {
  const raw = readFileSync(ASSET_MANIFEST_PATH, 'utf-8');
  const entries = JSON.parse(raw);
  const map = new Map();

  for (const entry of entries) {
    map.set(entry.key, entry);
  }

  return map;
}

function parseMetadata(block) {
  const metadata = {};
  const lines = block.split('\n');

  for (const line of lines) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const value = match[2].trim().replace(/\s+/g, ' ');
      metadata[key] = stripFormatting(value);
    }
  }

  return metadata;
}

function splitSections(markdown) {
  const lines = markdown.split('\n');
  const sections = new Map();

  let currentSection = 'intro';
  sections.set(currentSection, []);

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s+/, '').trim().toLowerCase();
      sections.set(currentSection, []);
      continue;
    }

    sections.get(currentSection)?.push(line);
  }

  return sections;
}

function normalizeParagraphs(lines) {
  const raw = lines
    .map((line) => line.trim())
    .filter((line) =>
      line.length > 0 &&
      !line.startsWith('<!--') &&
      !line.startsWith('##') &&
      !line.startsWith('###') &&
      !line.startsWith('>')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return stripFormatting(raw);
}

function extractBullets(lines) {
  const bullets = [];

  for (const line of lines) {
    if (line.trim().startsWith('- ')) {
      const cleaned = stripFormatting(line.trim().replace(/^-\s+/, ''));
      if (cleaned.length > 0) {
        bullets.push(cleaned);
      }
    }
  }

  return bullets;
}

function extractResults(lines) {
  const items = [];

  for (const line of lines) {
    if (!line.trim().startsWith('- ')) continue;

    const content = line.trim().replace(/^-\s+/, '').trim();
    const boldMatch = content.match(/^\*\*(.+?):\*\*\s*(.+)$/);

    if (boldMatch) {
      const label = stripFormatting(boldMatch[1]).replace(/[:：]+$/, '');
      const value = stripFormatting(boldMatch[2]);
      items.push({
        label,
        value,
      });
    } else {
      items.push({
        label: stripFormatting(content),
        value: '',
      });
    }
  }

  return items;
}

function parseProcess(lines) {
  const trimmed = lines.map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith('<!--'));

  if (trimmed.length === 0) {
    return [];
  }

  const arrowLine = trimmed.find((line) => line.includes('→') || line.includes('->'));
  if (arrowLine) {
    return arrowLine
      .split(/→|->/)
      .map((step) => step.trim())
      .filter(Boolean)
      .map((title) => ({ title }));
  }

  const bulletSteps = trimmed
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s+/, '').trim());

  if (bulletSteps.length > 0) {
    return bulletSteps.map((title) => ({ title }));
  }

  const orderedSteps = trimmed
    .map((line) => line.replace(/^[0-9]+[.)]\s*/, '').trim())
    .filter((line) => line.length > 0);

  if (orderedSteps.length > 0) {
    return orderedSteps.map((title) => ({ title }));
  }

  return trimmed.map((title) => ({ title }));
}

function resolveAsset(manifest, key) {
  const meta = manifest.get(key);
  if (!meta) return null;

  const bucketPath = meta.bucketPath || '';
  const normalizedPath = bucketPath
    .replace(/^r2:\/\//, '')
    .replace(/^jpstas\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  const base = `${ASSET_BASE_URL.replace(/\/+$/, '')}/${normalizedPath}`;
  const filename = meta.suggestedFilename ? `/${meta.suggestedFilename.replace(/^\/+/, '')}` : '';
  const src = `${base}${filename}`;

  return {
    src,
    alt: meta.alt || '',
    caption: meta.caption || undefined,
    type: meta.type === 'video' ? 'video' : 'image',
  };
}

function buildCaseStudy(manifest, slug, markdown) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  const metadataBlock = markdown.split(/\n##\s+/)[0];
  const metadata = {
    ...parseMetadata(markdown),
    ...parseMetadata(metadataBlock),
  };

  const sections = splitSections(markdown);
  const challengeSection = sections.get('challenge') || [];
  const solutionSection = sections.get('solution') || [];
  const contentSection = sections.get('content') || [];
  const resultsSection = sections.get('results') || [];
  const processSection = sections.get('process') || [];
  const gallerySection = sections.get('gallery (placeholders)') || [];

  const challengeText = normalizeParagraphs(
    challengeSection.filter((line) => !line.trim().startsWith('- '))
  );
  const challengeBullets = extractBullets(challengeSection);

  const solutionText = normalizeParagraphs(
    solutionSection.filter((line) => !line.trim().startsWith('- '))
  );
  const solutionBullets = extractBullets(solutionSection);

  const contentText = normalizeParagraphs(contentSection);

  const results = extractResults(resultsSection);
  const processSteps = parseProcess(processSection);

  const galleryKeys = gallerySection
    .map((line) => line.match(/\{\{ASSET:([^}]+)\}\}/)?.[1])
    .filter(Boolean);

  const gallery = galleryKeys
    .map((key) => resolveAsset(manifest, key))
    .filter((asset) => asset && asset.type === 'image')
    .map((asset) => ({ src: asset.src, alt: asset.alt, caption: asset.caption }));

  const heroKey = galleryKeys.find((key) => key.endsWith('/hero'));
  const heroAsset = heroKey ? resolveAsset(manifest, heroKey) : null;

  const tags = splitList(metadata['tags']);
  const skills = splitList(metadata['skills']);
  const keywords = splitList(metadata['keywords']);
  const tools = splitList(metadata['technologies']);

  const summary = metadata['summary'] || contentText || challengeText;

  const metrics = results.slice(0, 3).map((metric) => ({
    label: metric.label,
    value: metric.value,
  }));

  while (metrics.length < 3) {
    metrics.push({ label: `Highlight ${metrics.length + 1}`, value: '' });
  }

  const config = STUDY_CONFIG[slug] || { category: 'design', featured: false };

  return {
    slug,
    title,
    tagline: summary,
    hero: heroAsset
      ? { src: heroAsset.src, alt: heroAsset.alt }
      : undefined,
    cardImage: heroAsset
      ? { src: heroAsset.src, alt: heroAsset.alt }
      : undefined,
    metrics,
    meta: {
      tags: Array.from(new Set([...tags, ...skills])),
      tools,
      year: metadata['year'] || undefined,
      client: metadata['client'] || undefined,
    },
    context: {
      problem: challengeText || summary,
      constraints: challengeBullets.length ? challengeBullets : undefined,
      quote: metadata['quote'] || undefined,
    },
    solution: {
      approach: solutionText || contentText || summary,
      bullets: solutionBullets.length ? solutionBullets : undefined,
      gallery: gallery.length ? gallery : undefined,
    },
    impact: results.length ? results : metrics,
    process: processSteps.length ? processSteps : [{ title: 'Discovery' }],
    reflection: {
      learning: contentText || summary,
      reuse: skills.length ? skills : undefined,
    },
    category: config.category,
    featured: config.featured,
    related: [],
  };
}

function main() {
  const manifest = loadManifest();

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = readdirSync(PORTFOLIO_MD_DIR)
    .filter((file) => file.endsWith('.md'));

  for (const file of files) {
    const filePath = join(PORTFOLIO_MD_DIR, file);
    const markdown = readFileSync(filePath, 'utf-8');
    const metadataBlock = markdown.split(/\n##\s+/)[0];
    const metadata = parseMetadata(metadataBlock);

    if ((metadata['type'] || '').toLowerCase() !== 'case-study') {
      continue;
    }

    const slug = basename(file, '.md');
    const caseStudy = buildCaseStudy(manifest, slug, markdown);

    const outputPath = join(OUTPUT_DIR, `${slug}.json`);
    writeFileSync(outputPath, JSON.stringify(caseStudy, null, 2));
    console.log(`Generated ${outputPath}`);
  }
}

main();

