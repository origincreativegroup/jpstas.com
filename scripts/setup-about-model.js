/**
 * Setup About Page Model in Builder.io
 *
 * This script creates/updates the about-page model with proper field definitions
 * Run: node scripts/setup-about-model.js
 */

const { BUILDER_PRIVATE_KEY } = process.env;

if (!BUILDER_PRIVATE_KEY) {
  console.error('❌ Missing BUILDER_PRIVATE_KEY environment variable.');
  console.error('   Set it before running this script (see .env.example for details).');
  process.exit(1);
}

async function setupAboutPageModel() {
  console.log('🔧 Setting up about-page model in Builder.io...\n');

  const modelConfig = {
    name: 'about-page',
    kind: 'data',
    fields: [
      {
        name: 'heading',
        type: 'string',
        required: true,
        helperText: 'Main page heading',
      },
      {
        name: 'subheading',
        type: 'longText',
        required: true,
        helperText: 'Subheading text',
      },
      {
        name: 'bio',
        type: 'longText',
        helperText: 'Biography text',
      },
      {
        name: 'src',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'],
        required: true,
        helperText: 'Profile image URL',
      },
      {
        name: 'alt',
        type: 'string',
        required: true,
        helperText: 'Image alt text for accessibility',
      },
      {
        name: 'caption',
        type: 'string',
        helperText: 'Image caption',
      },
      {
        name: 'background',
        type: 'object',
        subFields: [
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'paragraphs',
            type: 'list',
            subFields: [
              {
                name: 'paragraph',
                type: 'longText',
              },
            ],
          },
        ],
      },
      {
        name: 'skills',
        type: 'list',
        subFields: [
          {
            name: 'category',
            type: 'string',
          },
          {
            name: 'iconColor',
            type: 'string',
          },
          {
            name: 'items',
            type: 'list',
            subFields: [
              {
                name: 'item',
                type: 'string',
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://builder.io/api/v1/models/about-page?apiKey=${BUILDER_PRIVATE_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelConfig),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Successfully configured about-page model');
    console.log('📋 Fields added:', modelConfig.fields.map(f => f.name).join(', '));
    console.log('\n✨ Now go to Builder.io → Models → about-page to see the form fields!');

    return result;
  } catch (error) {
    console.error('❌ Error setting up model:', error.message);
    console.error('\n💡 You may need to create the model manually in Builder.io first.');
    throw error;
  }
}

// Run the setup
setupAboutPageModel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
