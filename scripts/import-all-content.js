/**
 * Import all content to Builder.io
 *
 * This script:
 * 1. Creates all content models
 * 2. Imports all portfolio projects
 * 3. Imports homepage, about page, and site settings
 *
 * Run with: node scripts/import-all-content.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { BUILDER_PRIVATE_KEY, BUILDER_PUBLIC_KEY } = process.env;

if (!BUILDER_PRIVATE_KEY) {
  console.error('❌ Missing BUILDER_PRIVATE_KEY environment variable.');
  console.error('   Set it before running this script (see .env.example for details).');
  process.exit(1);
}

if (!BUILDER_PUBLIC_KEY) {
  console.error('❌ Missing BUILDER_PUBLIC_KEY environment variable.');
  console.error('   Set it before running this script (see .env.example for details).');
  process.exit(1);
}

const API_BASE = 'https://builder.io/api/v1';

/**
 * Content model definitions
 */
const models = [
  {
    name: 'portfolio-project',
    displayName: 'Portfolio Project',
    kind: 'data',
    description: 'Individual portfolio projects showcasing design and technical work',
  },
  {
    name: 'homepage',
    displayName: 'Homepage',
    kind: 'data',
    description: 'Homepage content and featured projects',
    singleEntry: true,
  },
  {
    name: 'about-page',
    displayName: 'About Page',
    kind: 'data',
    description: 'About page content, bio, and experience',
    singleEntry: true,
  },
  {
    name: 'site-settings',
    displayName: 'Site Settings',
    kind: 'data',
    description: 'Global site settings, navigation, and metadata',
    singleEntry: true,
  },
];

/**
 * Portfolio projects to import
 */
const portfolioProjects = [
  'brand-evolution',
  'website-redesign',
  'customer-experience-systems',
  'in-house-print-studio',
  'media-campaigns',
];

/**
 * Create a model in Builder.io
 */
async function createModel(model) {
  console.log(`\n📝 Creating model: ${model.displayName} (${model.name})`);

  try {
    const response = await fetch(`${API_BASE}/write/models`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUILDER_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message?.includes('already exists')) {
        console.log(`⚠️  Model "${model.name}" already exists, skipping...`);
        return { success: true, skipped: true };
      }
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    console.log(`✅ Created model: ${model.displayName}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error creating model ${model.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create content entry in Builder.io
 */
async function createContent(modelName, data, entryName) {
  console.log(`\n📤 Importing: ${entryName} to ${modelName}`);

  try {
    const response = await fetch(`${API_BASE}/write/${modelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUILDER_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: entryName,
        data: data,
        published: 'published',
        modelId: modelName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log(`✅ Imported: ${entryName} (ID: ${result.id})`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Error importing ${entryName}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Read JSON file
 */
function readJSON(filepath) {
  try {
    const fullPath = join(__dirname, '..', filepath);
    const content = readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filepath}:`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Builder.io Content Import');
  console.log('=' .repeat(60));
  console.log(`Using Builder API key (masked): ${BUILDER_PRIVATE_KEY.substring(0, 6)}…`);
  console.log('=' .repeat(60));

  const results = {
    models: { created: [], skipped: [], failed: [] },
    content: { imported: [], failed: [] },
  };

  // Step 1: Create all models
  console.log('\n\n📋 STEP 1: Creating Content Models');
  console.log('=' .repeat(60));

  for (const model of models) {
    const result = await createModel(model);

    if (result.success) {
      if (result.skipped) {
        results.models.skipped.push(model.name);
      } else {
        results.models.created.push(model.name);
      }
    } else {
      results.models.failed.push({ model: model.name, error: result.error });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 2: Import homepage
  console.log('\n\n🏠 STEP 2: Importing Homepage Content');
  console.log('=' .repeat(60));

  const homepageData = readJSON('src/data/site/homepage.json');
  if (homepageData) {
    const result = await createContent('homepage', homepageData, 'Homepage');
    if (result.success) {
      results.content.imported.push('Homepage');
    } else {
      results.content.failed.push({ name: 'Homepage', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 3: Import about page
  console.log('\n\n👤 STEP 3: Importing About Page');
  console.log('=' .repeat(60));

  const aboutData = readJSON('src/data/site/about.json');
  if (aboutData) {
    const result = await createContent('about-page', aboutData, 'About Page');
    if (result.success) {
      results.content.imported.push('About Page');
    } else {
      results.content.failed.push({ name: 'About Page', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 4: Import site settings
  console.log('\n\n⚙️  STEP 4: Importing Site Settings');
  console.log('=' .repeat(60));

  const settingsData = readJSON('src/data/site/settings.json');
  if (settingsData) {
    const result = await createContent('site-settings', settingsData, 'Site Settings');
    if (result.success) {
      results.content.imported.push('Site Settings');
    } else {
      results.content.failed.push({ name: 'Site Settings', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    // Create default settings if file doesn't exist
    const defaultSettings = {
      siteName: 'John P. Stas',
      siteDescription: 'Creative Technologist & Designer Portfolio',
      siteUrl: 'https://www.jpstas.com',
      author: {
        name: 'John P. Stas',
        email: 'contact@jpstas.com',
        social: {
          linkedin: 'https://www.linkedin.com/in/johnpstas',
          github: 'https://github.com/jpstas',
        },
      },
      navigation: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Resume', href: '/resume' },
        { label: 'Contact', href: '/contact' },
      ],
      footer: {
        copyright: `© ${new Date().getFullYear()} John P. Stas. All rights reserved.`,
        links: [],
      },
    };

    const result = await createContent('site-settings', defaultSettings, 'Site Settings');
    if (result.success) {
      results.content.imported.push('Site Settings (default)');
    } else {
      results.content.failed.push({ name: 'Site Settings', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 5: Import all portfolio projects
  console.log('\n\n💼 STEP 5: Importing Portfolio Projects');
  console.log('=' .repeat(60));

  for (const projectSlug of portfolioProjects) {
    const projectData = readJSON(`src/data/portfolio/${projectSlug}.json`);

    if (projectData) {
      const result = await createContent(
        'portfolio-project',
        projectData,
        projectData.title || projectSlug
      );

      if (result.success) {
        results.content.imported.push(projectData.title || projectSlug);
      } else {
        results.content.failed.push({
          name: projectData.title || projectSlug,
          error: result.error,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⚠️  Could not find data file for ${projectSlug}`);
    }
  }

  // Print summary
  console.log('\n\n' + '=' .repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('=' .repeat(60));

  console.log('\n📋 Models:');
  console.log(`   ✅ Created: ${results.models.created.length}`);
  results.models.created.forEach(m => console.log(`      - ${m}`));
  console.log(`   ⚠️  Skipped: ${results.models.skipped.length} (already existed)`);
  results.models.skipped.forEach(m => console.log(`      - ${m}`));
  console.log(`   ❌ Failed: ${results.models.failed.length}`);
  results.models.failed.forEach(({ model, error }) => {
    console.log(`      - ${model}: ${error}`);
  });

  console.log('\n📤 Content:');
  console.log(`   ✅ Imported: ${results.content.imported.length}`);
  results.content.imported.forEach(c => console.log(`      - ${c}`));
  console.log(`   ❌ Failed: ${results.content.failed.length}`);
  results.content.failed.forEach(({ name, error }) => {
    console.log(`      - ${name}: ${error}`);
  });

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 Import Complete!');
  console.log('=' .repeat(60));
  console.log('\n📍 Next Steps:');
  console.log('   1. Visit https://builder.io/content to view your content');
  console.log('   2. Edit any content in the Builder.io visual editor');
  console.log('   3. Test your site locally: npm run dev');
  console.log('   4. Visit http://localhost:5173/builder-example to verify');
  console.log('\n');

  if (results.content.failed.length > 0 || results.models.failed.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
