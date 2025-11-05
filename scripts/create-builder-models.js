/**
 * Script to create Builder.io content models via API
 *
 * This script automates the creation of all content models in Builder.io
 * Run with: node scripts/create-builder-models.js
 *
 * Note: This requires a PRIVATE API key (not the public key)
 * Get it from: https://builder.io/account/organization?root=true
 */

const BUILDER_PRIVATE_KEY = process.env.BUILDER_PRIVATE_KEY;

if (!BUILDER_PRIVATE_KEY) {
  console.error('❌ Error: BUILDER_PRIVATE_KEY environment variable not set');
  console.log('\n📖 To get your private API key:');
  console.log('1. Go to https://builder.io/account/organization?root=true');
  console.log('2. Navigate to "API Keys" section');
  console.log('3. Copy the "Private Key"');
  console.log('4. Set environment variable: export BUILDER_PRIVATE_KEY=your_key\n');
  process.exit(1);
}

// Content model definitions
const models = {
  'portfolio-project': {
    name: 'Portfolio Project',
    kind: 'data',
    fields: [
      { name: 'slug', type: 'text', required: true, helperText: 'URL-friendly identifier (e.g., print-studio)' },
      { name: 'title', type: 'text', required: true },
      { name: 'tagline', type: 'text' },
      {
        name: 'hero',
        type: 'object',
        subFields: [
          { name: 'src', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'] },
          { name: 'alt', type: 'text' },
        ],
      },
      {
        name: 'cardImage',
        type: 'object',
        subFields: [
          { name: 'src', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'] },
          { name: 'alt', type: 'text' },
        ],
      },
      {
        name: 'metrics',
        type: 'list',
        subFields: [
          { name: 'label', type: 'text' },
          { name: 'value', type: 'text' },
        ],
      },
      {
        name: 'meta',
        type: 'object',
        subFields: [
          { name: 'tags', type: 'list', subFields: [{ name: 'tag', type: 'text' }] },
          { name: 'tools', type: 'list', subFields: [{ name: 'tool', type: 'text' }] },
          { name: 'year', type: 'text' },
          { name: 'client', type: 'text' },
        ],
      },
      {
        name: 'context',
        type: 'object',
        subFields: [
          { name: 'problem', type: 'longText' },
          { name: 'constraints', type: 'list', subFields: [{ name: 'constraint', type: 'text' }] },
          { name: 'quote', type: 'text' },
        ],
      },
      {
        name: 'solution',
        type: 'object',
        subFields: [
          { name: 'approach', type: 'longText' },
          { name: 'bullets', type: 'list', subFields: [{ name: 'bullet', type: 'text' }] },
          {
            name: 'gallery',
            type: 'list',
            subFields: [
              { name: 'src', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp', 'mp4'] },
              { name: 'alt', type: 'text' },
              { name: 'caption', type: 'text' },
              { name: 'type', type: 'text', enum: ['image', 'video'], defaultValue: 'image' },
              { name: 'poster', type: 'file', helperText: 'Thumbnail for video' },
            ],
          },
        ],
      },
      {
        name: 'impact',
        type: 'list',
        subFields: [
          { name: 'label', type: 'text' },
          { name: 'value', type: 'text' },
        ],
      },
      {
        name: 'process',
        type: 'list',
        subFields: [
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' },
        ],
      },
      {
        name: 'reflection',
        type: 'object',
        subFields: [
          { name: 'learning', type: 'longText' },
          { name: 'reuse', type: 'list', subFields: [{ name: 'item', type: 'text' }] },
        ],
      },
      {
        name: 'related',
        type: 'list',
        subFields: [
          { name: 'title', type: 'text' },
          { name: 'href', type: 'text' },
        ],
      },
    ],
  },

  'homepage': {
    name: 'Homepage',
    kind: 'data',
    singleEntry: true,
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'subtitle', type: 'text' },
      { name: 'description', type: 'longText' },
      { name: 'heroImage', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
      { name: 'heroImageAlt', type: 'text' },
      {
        name: 'featuredProjects',
        type: 'list',
        subFields: [
          { name: 'title', type: 'text' },
          { name: 'slug', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
          { name: 'category', type: 'text' },
          { name: 'tags', type: 'list', subFields: [{ name: 'tag', type: 'text' }] },
        ],
      },
      {
        name: 'metrics',
        type: 'list',
        subFields: [
          { name: 'label', type: 'text' },
          { name: 'value', type: 'text' },
        ],
      },
    ],
  },

  'about-page': {
    name: 'About Page',
    kind: 'data',
    singleEntry: true,
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'subtitle', type: 'text' },
      { name: 'bio', type: 'richText' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
      {
        name: 'skills',
        type: 'list',
        subFields: [
          { name: 'category', type: 'text' },
          { name: 'skills', type: 'list', subFields: [{ name: 'skill', type: 'text' }] },
        ],
      },
      {
        name: 'experience',
        type: 'list',
        subFields: [
          { name: 'title', type: 'text' },
          { name: 'company', type: 'text' },
          { name: 'period', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'achievements', type: 'list', subFields: [{ name: 'achievement', type: 'text' }] },
        ],
      },
      {
        name: 'education',
        type: 'list',
        subFields: [
          { name: 'degree', type: 'text' },
          { name: 'school', type: 'text' },
          { name: 'year', type: 'text' },
        ],
      },
    ],
  },

  'site-settings': {
    name: 'Site Settings',
    kind: 'data',
    singleEntry: true,
    fields: [
      { name: 'siteName', type: 'text', required: true },
      { name: 'siteDescription', type: 'text' },
      { name: 'siteUrl', type: 'text' },
      {
        name: 'author',
        type: 'object',
        subFields: [
          { name: 'name', type: 'text' },
          { name: 'email', type: 'email' },
          {
            name: 'social',
            type: 'object',
            subFields: [
              { name: 'linkedin', type: 'url' },
              { name: 'github', type: 'url' },
              { name: 'twitter', type: 'url' },
            ],
          },
        ],
      },
      {
        name: 'navigation',
        type: 'list',
        subFields: [
          { name: 'label', type: 'text' },
          { name: 'href', type: 'text' },
          { name: 'external', type: 'boolean', defaultValue: false },
        ],
      },
      {
        name: 'footer',
        type: 'object',
        subFields: [
          { name: 'copyright', type: 'text' },
          {
            name: 'links',
            type: 'list',
            subFields: [
              { name: 'label', type: 'text' },
              { name: 'href', type: 'text' },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Create a model in Builder.io
 */
async function createModel(modelKey, modelConfig) {
  console.log(`\n📝 Creating model: ${modelConfig.name} (${modelKey})`);

  try {
    const response = await fetch('https://builder.io/api/v1/models', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUILDER_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelKey,
        ...modelConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.message?.includes('already exists')) {
        console.log(`⚠️  Model "${modelKey}" already exists, skipping...`);
        return { success: true, skipped: true };
      }
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log(`✅ Created model: ${modelConfig.name}`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Error creating model ${modelKey}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating Builder.io content models...\n');
  console.log('Models to create:', Object.keys(models).join(', '));

  const results = {
    created: [],
    skipped: [],
    failed: [],
  };

  for (const [modelKey, modelConfig] of Object.entries(models)) {
    const result = await createModel(modelKey, modelConfig);

    if (result.success) {
      if (result.skipped) {
        results.skipped.push(modelKey);
      } else {
        results.created.push(modelKey);
      }
    } else {
      results.failed.push({ model: modelKey, error: result.error });
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created: ${results.created.length} models`);
  if (results.created.length > 0) {
    results.created.forEach(model => console.log(`   - ${model}`));
  }

  console.log(`⚠️  Skipped: ${results.skipped.length} models (already exist)`);
  if (results.skipped.length > 0) {
    results.skipped.forEach(model => console.log(`   - ${model}`));
  }

  console.log(`❌ Failed: ${results.failed.length} models`);
  if (results.failed.length > 0) {
    results.failed.forEach(({ model, error }) => {
      console.log(`   - ${model}: ${error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Done! Visit https://builder.io/models to view your models');
  console.log('='.repeat(60) + '\n');

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
