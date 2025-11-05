/**
 * Builder.io Custom Component Registration
 *
 * This file defines custom Qwik components for Builder.io
 * that can be used in the visual editor with drag-and-drop
 */

import type { RegisteredComponent } from '@builder.io/sdk-qwik';
import { CloudflareR2Image } from '~/components/builder/CloudflareR2Image';
import { CloudflareStreamVideo } from '~/components/builder/CloudflareStreamVideo';

/**
 * Array of registered custom components for Builder.io
 * Pass this to <RenderContent customComponents={CUSTOM_COMPONENTS} />
 */
export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    component: CloudflareR2Image,
    name: 'CloudflareR2Image',
    friendlyName: 'Cloudflare R2 Image',
    description: 'Optimized image component for Cloudflare R2 with automatic resizing and responsive loading',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d',
    inputs: [
      {
        name: 'src',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
        required: true,
        helperText: 'Image URL from Cloudflare R2 (media.jpstas.com)',
        defaultValue: 'https://media.jpstas.com/',
      },
      {
        name: 'alt',
        type: 'string',
        required: true,
        helperText: 'Alt text for accessibility (describe the image)',
        defaultValue: '',
      },
      {
        name: 'width',
        type: 'number',
        helperText: 'Target width in pixels (for optimization)',
        advanced: false,
      },
      {
        name: 'height',
        type: 'number',
        helperText: 'Target height in pixels (for optimization)',
        advanced: false,
      },
      {
        name: 'optimize',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Enable Cloudflare Image Resizing optimization',
        advanced: true,
      },
      {
        name: 'quality',
        type: 'number',
        defaultValue: 85,
        helperText: 'Image quality (1-100)',
        advanced: true,
      },
      {
        name: 'format',
        type: 'string',
        enum: ['auto', 'webp', 'avif', 'jpeg', 'png'],
        defaultValue: 'auto',
        helperText: 'Image format (auto selects best format)',
        advanced: true,
      },
      {
        name: 'fit',
        type: 'string',
        enum: ['scale-down', 'contain', 'cover', 'crop', 'pad'],
        defaultValue: 'scale-down',
        helperText: 'How to fit the image in the dimensions',
        advanced: true,
      },
      {
        name: 'lazy',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Enable lazy loading',
        advanced: true,
      },
      {
        name: 'blurPlaceholder',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Show blur placeholder while loading',
        advanced: true,
      },
      {
        name: 'class',
        type: 'string',
        helperText: 'CSS class names',
        advanced: true,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: CloudflareStreamVideo,
    name: 'CloudflareStreamVideo',
    friendlyName: 'Cloudflare Stream Video',
    description: 'Video player for Cloudflare Stream with customizable controls and appearance',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2F7c6a6d8c8c3e4c5c8f8f8f8f8f8f8f8f',
    inputs: [
      {
        name: 'videoId',
        type: 'string',
        required: true,
        helperText: 'Cloudflare Stream video ID (32-character hex string)',
        defaultValue: '',
      },
      {
        name: 'title',
        type: 'string',
        helperText: 'Video title for accessibility',
        defaultValue: 'Video',
      },
      {
        name: 'poster',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'],
        helperText: 'Custom poster/thumbnail image (optional, auto-generated if not provided)',
      },
      {
        name: 'aspectRatio',
        type: 'string',
        enum: ['16:9', '4:3', '1:1', '9:16', '21:9'],
        defaultValue: '16:9',
        helperText: 'Video aspect ratio',
        advanced: false,
      },
      {
        name: 'autoplay',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Autoplay video on load',
        advanced: true,
      },
      {
        name: 'loop',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Loop video playback',
        advanced: true,
      },
      {
        name: 'muted',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Mute audio by default',
        advanced: true,
      },
      {
        name: 'controls',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show player controls',
        advanced: true,
      },
      {
        name: 'primaryColor',
        type: 'color',
        helperText: 'Player primary color (for buttons, progress bar)',
        advanced: true,
      },
      {
        name: 'loading',
        type: 'string',
        enum: ['lazy', 'eager'],
        defaultValue: 'lazy',
        helperText: 'Loading strategy',
        advanced: true,
      },
      {
        name: 'class',
        type: 'string',
        helperText: 'CSS class names',
        advanced: true,
      },
    ],
    canHaveChildren: false,
  },
];

/**
 * Component usage examples for documentation
 */
export const COMPONENT_EXAMPLES = {
  CloudflareR2Image: `
<CloudflareR2Image
  src="https://media.jpstas.com/portfolio/PrintStudio/IMG_0620.jpeg"
  alt="HP Latex printer in production"
  width={800}
  height={600}
  optimize={true}
  lazy={true}
/>
  `.trim(),

  CloudflareStreamVideo: `
<CloudflareStreamVideo
  videoId="af4889355cd0d36bac6722871cb2bcb3"
  title="FPV Drone Flythrough"
  aspectRatio="16:9"
  autoplay={false}
  loop={false}
  controls={true}
/>
  `.trim(),
} as const;
