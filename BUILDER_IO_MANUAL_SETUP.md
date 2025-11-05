# Builder.io Manual Setup - Step by Step

Follow these steps to create models and import all content to Builder.io.

## Step 1: Create Models in Builder.io Dashboard

### 1.1 Create "portfolio-project" Model

1. Go to https://builder.io/models
2. Click **"+ New Model"**
3. Select **"Section"** or **"Data"** type → Choose **"Data"**
4. Enter model name: `portfolio-project`
5. Display name: `Portfolio Project`
6. Click **"Create Model"**
7. You now have an empty model - we'll add fields via the dashboard

### 1.2 Create "homepage" Model

1. Click **"+ New Model"**
2. Select **"Data"**
3. Model name: `homepage`
4. Display name: `Homepage`
5. Check **"This is a singleton (only one entry allowed)"**
6. Click **"Create Model"**

### 1.3 Create "about-page" Model

1. Click **"+ New Model"**
2. Select **"Data"**
3. Model name: `about-page`
4. Display name: `About Page`
5. Check **"This is a singleton"**
6. Click **"Create Model"**

### 1.4 Create "site-settings" Model

1. Click **"+ New Model"**
2. Select **"Data"**
3. Model name: `site-settings`
4. Display name: `Site Settings`
5. Check **"This is a singleton"**
6. Click **"Create Model"**

## Step 2: Import Content

Once all 4 models are created, run the import script:

```bash
node scripts/import-content-only.js
```

This will import:
- ✅ Homepage content
- ✅ About page content
- ✅ Site settings
- ✅ All 10 portfolio projects

## Step 3: Verify

1. Go to https://builder.io/content
2. You should see all your content!
3. Click on any entry to edit it

## Quick Checklist

- [ ] Model `portfolio-project` created
- [ ] Model `homepage` created (singleton)
- [ ] Model `about-page` created (singleton)
- [ ] Model `site-settings` created (singleton)
- [ ] Run import script: `node scripts/import-content-only.js`
- [ ] Verify content at https://builder.io/content
- [ ] Test locally: `npm run dev`
- [ ] Visit http://localhost:5173/builder-example

## Expected Results

After import, you should have:

**Homepage**: 1 entry
- Title, subtitle, description
- Hero image
- 3 featured projects
- 4 metrics

**About Page**: 1 entry
- Bio and personal info

**Site Settings**: 1 entry
- Site name, description
- Navigation links
- Footer info

**Portfolio Projects**: 10 entries
1. In-House Print Studio Build
2. Caribbean Pools Brand Evolution
3. Caribbean Pools Website & E-Commerce Platform
4. DeckHand: Field Service App Prototype
5. New Pool Drone Photo & Video Project
6. Formstack Digital Transformation
7. IVR Call Menu & Customer Experience Optimization
8. Email Marketing Campaigns
9. MindForge: AI Process Mapping
10. CaribbeanPools.com E-Commerce Launch

## Troubleshooting

**Import fails with "Model not found":**
- Make sure all 4 models are created
- Model names must match exactly (case-sensitive)
- Check at https://builder.io/models

**Some projects don't import:**
- Check if JSON file exists in `src/data/`
- Verify JSON is valid (no syntax errors)

**Content looks wrong:**
- Edit directly in Builder.io dashboard
- Content is live immediately after publish

## Next Steps

After successful import:

1. **Customize Content**
   - Edit any project in Builder.io
   - Add images, update text
   - Changes are instant!

2. **Add New Content**
   - Create new portfolio projects
   - Update homepage featured projects
   - Modify site settings

3. **Test Integration**
   - Visit `/builder-example` to see it working
   - Update other pages to use Builder.io data

4. **Deploy**
   - Content works automatically in production
   - No code changes needed!
