/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Functions Environment
 *
 * This file defines the environment bindings available to Cloudflare Pages Functions.
 * It provides TypeScript autocomplete and type checking for:
 * - KV Namespaces (Content and Media storage)
 * - Environment Variables (API tokens and configuration)
 */

interface Env {
  // KV Namespaces
  /** Content storage for CMS (home, about, contact, settings pages) */
  CONTENT_KV: KVNamespace;

  /** Media library metadata storage */
  MEDIA_KV: KVNamespace;

  // Cloudflare API Credentials
  /** Cloudflare Account ID for Stream and Images API */
  CLOUDFLARE_ACCOUNT_ID: string;

  /** Unified Cloudflare API token (or use separate tokens below) */
  CLOUDFLARE_API_TOKEN?: string;

  /** Cloudflare Stream API token (for video uploads) */
  CLOUDFLARE_STREAM_TOKEN?: string;

  /** Cloudflare Images API token (for image uploads) */
  CLOUDFLARE_IMAGES_TOKEN?: string;
}

/**
 * Global type declaration for PagesFunction
 * This allows TypeScript to understand the PagesFunction type used in API endpoints
 */
declare global {
  /**
   * Cloudflare Pages Function handler type
   * @template E - Environment bindings interface (defaults to Env)
   */
  type PagesFunction<E = Env> = import('@cloudflare/workers-types').PagesFunction<E>;

  /**
   * Cloudflare Pages Function context
   * Provides access to request, environment, params, and other utilities
   */
  type EventContext<
    E = Env,
    P extends string = string,
    D = unknown,
  > = import('@cloudflare/workers-types').EventContext<E, P, D>;
}

export {};
