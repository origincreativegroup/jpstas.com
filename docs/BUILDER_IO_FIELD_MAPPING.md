# Builder.io Field Mapping Guide

Complete field definitions for all content models in the jpstas.com portfolio site.

---

## Table of Contents

1. [Site Content Models](#site-content-models)
   - [Homepage](#1-homepage-homepage)
   - [About Page](#2-about-page-about-page)
   - [Site Settings](#3-site-settings-site-settings)
   - [Dashboard](#4-dashboard-dashboard)
2. [Portfolio Project Models](#portfolio-project-models)
   - [Portfolio Project Schema](#portfolio-project-portfolio-project)
3. [Individual Portfolio Projects](#individual-portfolio-projects)

---

## Site Content Models

### 1. Homepage (`homepage`)

**File:** `/Users/origin/GitHub/jpstas.com/src/data/site/homepage.json`
**Model Type:** Data
**Description:** Main landing page content including hero section, featured projects, and key metrics.

#### Fields:

- **title**
  - Type: `text`
  - Required: yes
  - Description: Main hero headline text
  - Example: "Creative Technologist & Designer"

- **subtitle**
  - Type: `text`
  - Required: yes
  - Description: Supporting tagline below the main title
  - Example: "Transforming business challenges into elegant solutions"

- **description**
  - Type: `longText`
  - Required: yes
  - Description: Brief introduction paragraph explaining expertise and approach
  - Helper Text: Keep to 2-3 sentences for optimal readability

- **heroImage**
  - Type: `file` (image URL)
  - Required: yes
  - Description: Main hero section background or featured image
  - Recommended Size: 800x600px or larger

- **heroImageAlt**
  - Type: `text`
  - Required: yes
  - Description: Alt text for hero image (accessibility)

- **featuredProjects**
  - Type: `list`
  - Required: yes
  - Description: Array of 3-6 featured portfolio projects to showcase
  - **Subfields:**
    - **title**
      - Type: `text`
      - Required: yes
      - Description: Project name/title
    - **slug**
      - Type: `text`
      - Required: yes
      - Description: URL-friendly identifier matching portfolio project file
      - Pattern: lowercase-with-hyphens
    - **description**
      - Type: `longText`
      - Required: yes
      - Description: Brief project summary (1-2 sentences)
      - Max Length: ~150 characters recommended
    - **image**
      - Type: `file` (image URL)
      - Required: yes
      - Description: Project thumbnail/card image
    - **category**
      - Type: `text`
      - Required: yes
      - Description: Project category label
      - Examples: "Process Innovation", "Brand Identity", "Web Design"
    - **tags**
      - Type: `list` of `text`
      - Required: yes
      - Description: Array of skill/technology tags
      - Example: ["Print Production", "Apparel Design", "Workflow Automation"]

- **metrics**
  - Type: `list`
  - Required: yes
  - Description: Key performance indicators or achievements to display
  - **Subfields:**
    - **label**
      - Type: `text`
      - Required: yes
      - Description: Metric name/description
      - Example: "Paper Reduction"
    - **value**
      - Type: `text`
      - Required: yes
      - Description: Metric value (can include symbols/units)
      - Example: "80%", "$250K+", "10+"

---

### 2. About Page (`about-page`)

**File:** `/Users/origin/GitHub/jpstas.com/src/data/site/about.json`
**Model Type:** Data
**Description:** Personal profile, skills, experience timeline, and call-to-action.

#### Fields:

- **heading**
  - Type: `text`
  - Required: yes
  - Description: Page main heading
  - Example: "About Me"

- **subheading**
  - Type: `longText`
  - Required: yes
  - Description: Introductory paragraph below heading
  - Helper Text: 2-4 sentences introducing yourself and your approach

- **bio**
  - Type: `longText`
  - Required: yes
  - Description: Extended biography with line breaks
  - Helper Text: Use \n for paragraph breaks, 3-5 paragraphs recommended

- **src**
  - Type: `file` (image URL)
  - Required: yes
  - Description: Profile photo/headshot image URL

- **alt**
  - Type: `text`
  - Required: yes
  - Description: Alt text for profile image

- **caption**
  - Type: `text`
  - Required: no
  - Description: Optional caption for profile image

- **background**
  - Type: `object`
  - Required: yes
  - Description: Background story section
  - **Subfields:**
    - **title**
      - Type: `text`
      - Required: yes
      - Description: Section heading
      - Example: "Background"
    - **paragraphs**
      - Type: `list` of `longText`
      - Required: yes
      - Description: Array of paragraph strings for background narrative
      - Helper Text: Each item is a separate paragraph

- **skills**
  - Type: `list`
  - Required: yes
  - Description: Skill categories with individual items
  - **Subfields:**
    - **category**
      - Type: `text`
      - Required: yes
      - Description: Skill category name
      - Example: "Design & UX", "Development", "Operations"
    - **iconColor**
      - Type: `text`
      - Required: yes
      - Description: Color theme identifier for category icon
      - Options: "primary", "secondary", "highlight", "charcoal"
    - **items**
      - Type: `list` of `text`
      - Required: yes
      - Description: Array of specific skills within this category
      - Example: ["UI/UX Design", "Brand Identity", "Design Systems"]

- **experience**
  - Type: `list`
  - Required: yes
  - Description: Timeline of professional experience
  - **Subfields:**
    - **period**
      - Type: `text`
      - Required: yes
      - Description: Date range for this role/period
      - Example: "2020 - Present"
    - **role**
      - Type: `text`
      - Required: yes
      - Description: Job title or role description
    - **description**
      - Type: `longText`
      - Required: yes
      - Description: Summary of responsibilities and achievements
    - **color**
      - Type: `text`
      - Required: yes
      - Description: Color theme for timeline item
      - Options: "primary", "secondary", "highlight"

- **cta**
  - Type: `object`
  - Required: yes
  - Description: Call-to-action section at bottom of page
  - **Subfields:**
    - **title**
      - Type: `text`
      - Required: yes
      - Description: CTA heading
      - Example: "Want to work together?"
    - **description**
      - Type: `text`
      - Required: yes
      - Description: Supporting text for CTA
    - **buttonText**
      - Type: `text`
      - Required: yes
      - Description: Button label text
    - **buttonLink**
      - Type: `text` (URL)
      - Required: yes
      - Description: Button destination URL

---

### 3. Site Settings (`site-settings`)

**File:** `/Users/origin/GitHub/jpstas.com/src/data/site/settings.json`
**Model Type:** Data
**Description:** Global site configuration including metadata, SEO, and social links.

#### Fields:

- **siteTitle**
  - Type: `text`
  - Required: yes
  - Description: Site name used in page titles and metadata
  - Example: "John P. Stas"

- **siteDescription**
  - Type: `longText`
  - Required: yes
  - Description: Default meta description for SEO
  - Max Length: 155-160 characters recommended

- **authorName**
  - Type: `text`
  - Required: yes
  - Description: Content author/owner name

- **authorEmail**
  - Type: `text` (email)
  - Required: yes
  - Description: Primary contact email address

- **logo**
  - Type: `text` (file path)
  - Required: yes
  - Description: Path to site logo/favicon
  - Example: "/favicon.svg"

- **social**
  - Type: `object`
  - Required: yes
  - Description: Social media profile links
  - **Subfields:**
    - **linkedin**
      - Type: `text` (URL)
      - Required: no
      - Description: LinkedIn profile URL
    - **github**
      - Type: `text` (URL)
      - Required: no
      - Description: GitHub profile URL
    - **email**
      - Type: `text` (email)
      - Required: yes
      - Description: Contact email (duplicate of authorEmail)

- **seo**
  - Type: `object`
  - Required: yes
  - Description: SEO and social sharing configuration
  - **Subfields:**
    - **description**
      - Type: `longText`
      - Required: yes
      - Description: Default SEO meta description
      - Max Length: 155-160 characters
    - **keywords**
      - Type: `list` of `text`
      - Required: yes
      - Description: Array of SEO keywords/phrases
      - Helper Text: 8-15 keywords recommended
    - **ogImage**
      - Type: `text` (file path)
      - Required: yes
      - Description: Default Open Graph image for social sharing
      - Recommended Size: 1200x630px

---

### 4. Dashboard (`dashboard`)

**File:** `/Users/origin/GitHub/jpstas.com/src/data/site/dashboard.json`
**Model Type:** Data
**Description:** Analytics dashboard with metrics, live feeds, and visualization configuration.

#### Fields:

- **metrics**
  - Type: `list`
  - Required: yes
  - Description: Array of performance metrics with detailed breakdowns
  - **Subfields:**
    - **id**
      - Type: `text`
      - Required: yes
      - Description: Unique identifier (slug format)
      - Example: "revenue", "cost-savings", "projects"
    - **label**
      - Type: `text`
      - Required: yes
      - Description: Display name for metric
      - Example: "Revenue Generated"
    - **value**
      - Type: `text`
      - Required: yes
      - Description: Primary metric value with units
      - Example: "$100k+", "50+", "98%"
    - **trend**
      - Type: `text`
      - Required: yes
      - Description: Trend direction
      - Options: "up", "down", "neutral"
    - **trendValue**
      - Type: `text`
      - Required: no
      - Description: Trend change percentage/amount
      - Example: "+25%"
    - **priority**
      - Type: `text`
      - Required: yes
      - Description: Display priority level
      - Options: "high", "medium", "low"
    - **icon**
      - Type: `text`
      - Required: yes
      - Description: Icon identifier for visualization
      - Examples: "dollar", "trending-up", "briefcase", "calendar", "star", "leaf"
    - **details**
      - Type: `object`
      - Required: yes
      - Description: Expanded metric information
      - **Subfields:**
        - **description**
          - Type: `longText`
          - Required: yes
          - Description: Full explanation of metric
        - **breakdown**
          - Type: `list`
          - Required: yes
          - Description: Detailed breakdown of metric components
          - **Subfields:**
            - **label**
              - Type: `text`
              - Required: yes
              - Description: Component name
            - **value**
              - Type: `text`
              - Required: yes
              - Description: Component value with units
            - **percentage**
              - Type: `number`
              - Required: yes
              - Description: Percentage of total (0-100)
            - **color**
              - Type: `text`
              - Required: yes
              - Description: Color theme for visualization
              - Options: "primary", "secondary", "highlight"
        - **lastUpdated**
          - Type: `text` (date)
          - Required: yes
          - Description: ISO date string or formatted date
          - Example: "2024-01-15"

- **liveFeeds**
  - Type: `list`
  - Required: yes
  - Description: Real-time or frequently updated data feeds
  - **Subfields:**
    - **id**
      - Type: `text`
      - Required: yes
      - Description: Unique feed identifier
    - **label**
      - Type: `text`
      - Required: yes
      - Description: Feed display name
    - **value**
      - Type: `number`
      - Required: yes
      - Description: Current numerical value
    - **previousValue**
      - Type: `number`
      - Required: yes
      - Description: Previous value for comparison/trend
    - **timestamp**
      - Type: `number`
      - Required: yes
      - Description: Unix timestamp (milliseconds)
    - **color**
      - Type: `text`
      - Required: yes
      - Description: Color theme for feed visualization
      - Options: "primary", "secondary", "highlight"

- **config**
  - Type: `object`
  - Required: yes
  - Description: Dashboard behavior configuration
  - **Subfields:**
    - **updateInterval**
      - Type: `number`
      - Required: yes
      - Description: Auto-refresh interval in milliseconds
      - Example: 5000 (5 seconds)
    - **animationDuration**
      - Type: `number`
      - Required: yes
      - Description: Animation transition time in milliseconds
    - **maxVisibleMetrics**
      - Type: `number`
      - Required: yes
      - Description: Maximum metrics to display at once
    - **autoRefresh**
      - Type: `boolean`
      - Required: yes
      - Description: Enable/disable automatic data refresh

---

## Portfolio Project Models

### Portfolio Project (`portfolio-project`)

**Model Type:** Data
**Description:** Universal schema for all portfolio project entries. Every portfolio project JSON file uses this exact structure.

#### Fields:

- **slug**
  - Type: `text`
  - Required: yes
  - Description: URL-friendly unique identifier for the project
  - Pattern: lowercase-with-hyphens
  - Helper Text: Must match filename and be unique across all projects

- **title**
  - Type: `text`
  - Required: yes
  - Description: Full project name/title
  - Example: "Caribbean Pools Brand Evolution"

- **tagline**
  - Type: `text`
  - Required: yes
  - Description: Short compelling project summary (one sentence)
  - Max Length: ~80 characters recommended
  - Example: "A decade-long brand transformation from $7M to $17M"

- **hero**
  - Type: `object`
  - Required: yes
  - Description: Main project hero media (top of project page)
  - **Subfields:**
    - **src**
      - Type: `file` (URL or video ID)
      - Required: yes
      - Description: Image URL or video identifier
      - Note: If video, use Cloudflare Stream ID or similar
    - **alt**
      - Type: `text`
      - Required: yes
      - Description: Alt text for accessibility
    - **type**
      - Type: `text`
      - Required: no (defaults to "image" if omitted)
      - Description: Media type identifier
      - Options: "image", "video"
    - **poster**
      - Type: `text` (URL)
      - Required: no (only for video type)
      - Description: Video poster/thumbnail image URL
    - **caption**
      - Type: `text`
      - Required: no
      - Description: Optional caption text below hero

- **cardImage**
  - Type: `object`
  - Required: yes
  - Description: Thumbnail image for project cards/listings
  - **Subfields:**
    - **src**
      - Type: `file` (URL)
      - Required: yes
      - Description: Card thumbnail image URL
    - **alt**
      - Type: `text`
      - Required: yes
      - Description: Alt text for thumbnail
    - **type**
      - Type: `text`
      - Required: no
      - Description: Media type (usually "image")

- **metrics**
  - Type: `list`
  - Required: yes
  - Description: Key quantifiable outcomes/achievements (3-4 recommended)
  - **Subfields:**
    - **label**
      - Type: `text`
      - Required: yes
      - Description: Metric name
      - Example: "Cost Savings", "Turnaround Time", "Fleet Branded"
    - **value**
      - Type: `text`
      - Required: yes
      - Description: Metric value with units/symbols
      - Example: "$250K+", "60% faster", "20+ vehicles"

- **meta**
  - Type: `object`
  - Required: yes
  - Description: Project metadata and classifications
  - **Subfields:**
    - **tags**
      - Type: `list` of `text`
      - Required: yes
      - Description: Skill/category tags for filtering
      - Example: ["Brand Identity", "Design Systems", "Creative Direction"]
    - **tools**
      - Type: `list` of `text`
      - Required: yes
      - Description: Technologies/tools used
      - Example: ["Adobe Illustrator", "Photoshop", "HP Latex 315"]
    - **year**
      - Type: `text`
      - Required: yes
      - Description: Project timeframe
      - Example: "2014-2025", "2021", "Ongoing"
    - **client**
      - Type: `text`
      - Required: no
      - Description: Client/company name or "Personal Project"

- **context**
  - Type: `object`
  - Required: yes
  - Description: Project background and challenges
  - **Subfields:**
    - **problem**
      - Type: `longText`
      - Required: yes
      - Description: Problem statement or business challenge
      - Helper Text: 2-3 sentences describing the core issue
    - **constraints**
      - Type: `list` of `text`
      - Required: yes
      - Description: Key limitations or requirements
      - Example: ["Must work offline", "Seasonal hiring spikes"]
    - **quote**
      - Type: `text`
      - Required: yes
      - Description: Memorable quote summarizing project goals
      - Helper Text: Client quote or project vision statement

- **solution**
  - Type: `object`
  - Required: yes
  - Description: Approach and implementation details
  - **Subfields:**
    - **approach**
      - Type: `longText`
      - Required: yes
      - Description: High-level solution overview
      - Helper Text: 2-4 sentences summarizing the strategy
    - **bullets**
      - Type: `list` of `text`
      - Required: yes
      - Description: Key solution components or deliverables
      - Helper Text: 4-6 bullet points recommended
    - **gallery**
      - Type: `list`
      - Required: yes
      - Description: Project screenshots, mockups, or media
      - **Subfields:**
        - **src**
          - Type: `file` (URL or video ID)
          - Required: yes
          - Description: Image URL or video identifier
        - **alt**
          - Type: `text`
          - Required: yes
          - Description: Alt text describing the image
        - **type**
          - Type: `text`
          - Required: no (defaults to "image")
          - Description: Media type
          - Options: "image", "video"
        - **caption**
          - Type: `text`
          - Required: no
          - Description: Caption text below image
        - **poster**
          - Type: `text` (URL)
          - Required: no (only for videos)
          - Description: Video thumbnail URL

- **impact**
  - Type: `list`
  - Required: yes
  - Description: Measurable outcomes and results
  - **Subfields:**
    - **label**
      - Type: `text`
      - Required: yes
      - Description: Outcome category
      - Example: "Brand Consistency", "Turnaround Time"
    - **value**
      - Type: `text`
      - Required: yes
      - Description: Result with units or description
      - Example: "-60%", "Real-time", "Unified Across All Media"

- **process**
  - Type: `list`
  - Required: yes
  - Description: Step-by-step project methodology
  - **Subfields:**
    - **title**
      - Type: `text`
      - Required: yes
      - Description: Process phase name
      - Example: "Discovery", "Design", "Development"
    - **description**
      - Type: `text`
      - Required: yes
      - Description: Brief explanation of this phase
      - Helper Text: 1 sentence describing activities

- **reflection**
  - Type: `object`
  - Required: yes
  - Description: Learnings and reusable insights
  - **Subfields:**
    - **learning**
      - Type: `longText`
      - Required: yes
      - Description: Key lesson or insight from project
      - Helper Text: 1-2 sentences capturing the main takeaway
    - **reuse**
      - Type: `list` of `text`
      - Required: yes
      - Description: Reusable components, patterns, or techniques
      - Example: ["Brand style guide templates", "Template standardization framework"]

- **related**
  - Type: `list`
  - Required: no
  - Description: Links to related portfolio projects
  - **Subfields:**
    - **title**
      - Type: `text`
      - Required: yes
      - Description: Related project title
    - **href**
      - Type: `text` (URL path)
      - Required: yes
      - Description: Link to related project
      - Pattern: /portfolio/project-slug

---

## Individual Portfolio Projects

All portfolio projects use the **Portfolio Project** schema defined above. Below is a reference list of all existing project files:

### Project Files

1. **Brand Evolution** (`brand-evolution`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/brand-evolution.json`
   - Category: Brand Identity, Design Systems

2. **Caribbean Pools Website** (`caribbeanpools-redesign`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/caribbeanpools.json`
   - Category: E-Commerce, Web Design, UI/UX

3. **Caribbean Drone Media** (`caribbean-drone`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/caribbean-drone.json`
   - Category: Drone Photography, Content Production

4. **DeckHand App** (`deckhand-prototype`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/deckhand.json`
   - Category: Mobile App, React Native, Process Design

5. **Drone Media Project** (`drone-media`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/drone-media.json`
   - Category: Drone Photography, FPV, Videography

6. **Email Marketing** (`email-marketing`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/email-marketing.json`
   - Category: Email Marketing, Automation, CRM

7. **Formstack Integration** (`formstack-integration`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/formstack.json`
   - Category: Process Automation, Form UX, CRM Integration

8. **IVR System** (`ivr-system`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/ivr-system.json`
   - Category: IVR System, Customer Experience, Process Optimization

9. **MindForge** (`mindforge`)
   - File: `/Users/origin/GitHub/jpstas.com/src/data/mindforge.json`
   - Category: AI, SaaS, Process Mapping, Data Visualization

10. **Personal Drone Projects** (`personal-drone`)
    - File: `/Users/origin/GitHub/jpstas.com/src/data/personal-drone.json`
    - Category: FPV, Cinematic, Freelance

11. **Print Studio** (`print-studio`)
    - File: `/Users/origin/GitHub/jpstas.com/src/data/printstudio.json`
    - Category: Print Production, Apparel Design, Process Innovation

12. **ShopCaribbeanPools** (`shopcaribbeanpools`)
    - File: `/Users/origin/GitHub/jpstas.com/src/data/shopcaribbeanpools.json`
    - Category: E-Commerce, UX Design, Web Development

---

## Builder.io Implementation Notes

### Model Creation Strategy

1. **Create Data Models** (not Page models) for all content types
2. **Use consistent field naming** across all models
3. **Set up field validation** for required fields
4. **Configure default values** where appropriate

### Field Type Mapping

| JSON Type | Builder.io Field Type |
|-----------|----------------------|
| String (short) | Text |
| String (long/multiline) | Long Text |
| URL/Path | Text (with URL validation) |
| Image URL | File (Image) |
| Boolean | Boolean |
| Number | Number |
| Array of strings | List of Text |
| Array of objects | List of Objects |
| Nested object | Object with nested fields |

### Helper Text Recommendations

- **slug fields**: "URL-friendly identifier (lowercase-with-hyphens)"
- **tagline fields**: "Keep to one compelling sentence (~80 characters)"
- **description fields**: "2-3 sentences for optimal readability"
- **image fields**: "Recommended size: [specific dimensions]"
- **metrics**: "Include units/symbols (e.g., $250K+, 80%, 10+)"
- **tags/tools**: "Add relevant skills and technologies"

### Validation Rules

- **slug**: Pattern match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- **email**: Email format validation
- **url**: URL format validation
- **required fields**: Mark all fields listed as "Required: yes"

### Content Relationships

- **featuredProjects.slug** → Must match a **portfolio-project.slug**
- **related.href** → Must link to valid portfolio project path
- Use Builder.io's Reference field type for these relationships if possible

---

## Next Steps for Builder.io Setup

1. Create `homepage` data model with all fields above
2. Create `about-page` data model with all fields above
3. Create `site-settings` data model with all fields above
4. Create `dashboard` data model with all fields above
5. Create `portfolio-project` data model with universal schema
6. Import existing JSON data into Builder.io entries
7. Set up API integration for Astro site to fetch from Builder.io
8. Test all field types and nested structures
9. Configure preview URLs for live editing

---

**Document Version:** 1.0
**Last Updated:** 2025-11-05
**Total Models:** 5 (4 site models + 1 universal portfolio model)
**Total Portfolio Projects:** 12
