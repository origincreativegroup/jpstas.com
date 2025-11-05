/**
 * Import content to existing Builder.io models
 *
 * Prerequisites:
 * 1. Models must be created in Builder.io dashboard first
 * 2. Run: node scripts/create-builder-models.js (to create models via UI)
 *
 * This script imports all content from JSON files to Builder.io
 *
 * Run with: node scripts/import-content-only.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUILDER_PRIVATE_KEY = 'bpk-b9e456431ef94b648ed510057e7dec99';

/**
 * Portfolio projects to import
 */
const portfolioProjects = [
  'printstudio',
  'brand-evolution',
  'caribbeanpools',
  'deckhand',
  'drone-media',
  'formstack',
  'ivr-system',
  'email-marketing',
  'mindforge',
  'shopcaribbeanpools',
];

/**
 * Create content entry in Builder.io
 */
async function createContent(modelName, data, entryName) {
  console.log(`\n📤 Importing: ${entryName}`);

  try {
    const response = await fetch(`https://builder.io/api/v1/write/${modelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUILDER_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: entryName,
        data: data,
        published: 'published',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log(`   ✅ Success (ID: ${result.id})`);
    return { success: true, data: result };
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
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
  console.log('This will import all content to existing models');
  console.log('Make sure models are created in Builder.io first!');
  console.log('=' .repeat(60));

  const results = {
    imported: [],
    failed: [],
  };

  // Step 1: Import homepage
  console.log('\n🏠 Importing Homepage');
  console.log('-'.repeat(60));

  const homepageData = readJSON('src/data/site/homepage.json');
  if (homepageData) {
    const result = await createContent('homepage', homepageData, 'Homepage');
    if (result.success) {
      results.imported.push('Homepage');
    } else {
      results.failed.push({ name: 'Homepage', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 2: Import about page
  console.log('\n👤 Importing About Page');
  console.log('-'.repeat(60));

  const aboutData = readJSON('src/data/site/about.json');
  if (aboutData) {
    const result = await createContent('about-page', aboutData, 'About Page');
    if (result.success) {
      results.imported.push('About Page');
    } else {
      results.failed.push({ name: 'About Page', error: result.error });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    console.log('   ⚠️  No about.json found, skipping');
  }

  // Step 3: Import site settings
  console.log('\n⚙️  Importing Site Settings');
  console.log('-'.repeat(60));

  const settingsData = readJSON('src/data/site/settings.json');
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

  const settingsToImport = settingsData || defaultSettings;
  const result = await createContent('site-settings', settingsToImport, 'Site Settings');
  if (result.success) {
    results.imported.push('Site Settings');
  } else {
    results.failed.push({ name: 'Site Settings', error: result.error });
  }
  await new Promise(resolve => setTimeout(resolve, 500));

  // Step 4: Import all portfolio projects
  console.log('\n💼 Importing Portfolio Projects');
  console.log('-'.repeat(60));

  for (const projectSlug of portfolioProjects) {
    const projectData = readJSON(`src/data/${projectSlug}.json`);

    if (projectData) {
      const result = await createContent(
        'portfolio-project',
        projectData,
        projectData.title || projectSlug
      );

      if (result.success) {
        results.imported.push(projectData.title || projectSlug);
      } else {
        results.failed.push({
          name: projectData.title || projectSlug,
          error: result.error,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`\n📤 ${projectSlug}`);
      console.log(`   ⚠️  Data file not found, skipping`);
    }
  }

  // Print summary
  console.log('\n\n' + '=' .repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('=' .repeat(60));

  console.log(`\n✅ Successfully Imported: ${results.imported.length}`);
  results.imported.forEach(c => console.log(`   • ${c}`));

  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach(({ name, error }) => {
    console.log(`   • ${name}`);
    console.log(`     ${error}`);
  });

  console.log('\n' + '=' .repeat(60));
  if (results.failed.length === 0) {
    console.log('🎉 All Content Imported Successfully!');
  } else {
    console.log('⚠️  Some imports failed (see above)');
  }
  console.log('=' .repeat(60));

  if (results.failed.length > 0) {
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure models are created in Builder.io dashboard');
    console.log('   2. Visit https://builder.io/models to check');
    console.log('   3. Model names must match exactly:');
    console.log('      - portfolio-project');
    console.log('      - homepage');
    console.log('      - about-page');
    console.log('      - site-settings');
  }

  console.log('\n📍 Next Steps:');
  console.log('   1. Visit https://builder.io/content to view your content');
  console.log('   2. Edit content in the Builder.io visual editor');
  console.log('   3. Test: npm run dev');
  console.log('   4. Visit: http://localhost:5173/builder-example\n');

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
