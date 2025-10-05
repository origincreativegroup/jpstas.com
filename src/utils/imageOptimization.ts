// Image Optimization Utilities
// Handles auto-resize, WebP conversion, and responsive variants

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  generateVariants?: boolean;
  variants?: {
    thumbnail?: { width: number; height: number; quality?: number };
    medium?: { width: number; height: number; quality?: number };
    large?: { width: number; height: number; quality?: number };
  };
}

export interface OptimizedImage {
  original: string;
  webp?: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
    aspectRatio: number;
  };
}

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

class ImageOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Optimize an image file with various options
   */
  async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'auto',
      generateVariants = true,
      variants = {
        thumbnail: { width: 150, height: 150, quality: 0.7 },
        medium: { width: 800, height: 600, quality: 0.8 },
        large: { width: 1200, height: 900, quality: 0.9 },
      },
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const originalMetadata = {
            width: img.width,
            height: img.height,
            size: file.size,
            format: file.type,
            aspectRatio: img.width / img.height,
          };

          // Calculate optimal dimensions
          const { width, height } = this.calculateOptimalDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          );

          // Generate optimized versions
          const optimizedImage: OptimizedImage = {
            original: await this.createDataUrl(img, width, height, quality, file.type),
            metadata: {
              ...originalMetadata,
              width,
              height,
            },
          };

          // Generate WebP version if supported and requested
          if (this.supportsWebP() && (format === 'webp' || format === 'auto')) {
            optimizedImage.webp = await this.createDataUrl(img, width, height, quality, 'image/webp');
          }

          // Generate variants if requested
          if (generateVariants) {
            if (variants.thumbnail) {
              optimizedImage.thumbnail = await this.createVariant(
                img,
                variants.thumbnail.width,
                variants.thumbnail.height,
                variants.thumbnail.quality || 0.7,
                format
              );
            }

            if (variants.medium) {
              optimizedImage.medium = await this.createVariant(
                img,
                variants.medium.width,
                variants.medium.height,
                variants.medium.quality || 0.8,
                format
              );
            }

            if (variants.large) {
              optimizedImage.large = await this.createVariant(
                img,
                variants.large.width,
                variants.large.height,
                variants.large.quality || 0.9,
                format
              );
            }
          }

          resolve(optimizedImage);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Create a data URL for an optimized image
   */
  private async createDataUrl(
    img: HTMLImageElement,
    width: number,
    height: number,
    quality: number,
    format: string
  ): Promise<string> {
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw image with optimal scaling
    this.ctx.drawImage(img, 0, 0, width, height);

    return this.canvas.toDataURL(format, quality);
  }

  /**
   * Create a variant of the image
   */
  private async createVariant(
    img: HTMLImageElement,
    width: number,
    height: number,
    quality: number,
    format: string
  ): Promise<string> {
    const { width: scaledWidth, height: scaledHeight } = this.calculateOptimalDimensions(
      img.width,
      img.height,
      width,
      height
    );

    return this.createDataUrl(img, scaledWidth, scaledHeight, quality, format);
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;

    let width = originalWidth;
    let height = originalHeight;

    // Scale down if necessary
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * Check if WebP format is supported
   */
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Generate responsive image sources for HTML
   */
  generateResponsiveSources(optimizedImage: OptimizedImage): {
    src: string;
    srcSet: string;
    sizes: string;
  } {
    const sources: string[] = [];
    const sizes: string[] = [];

    // Add variants to srcSet
    if (optimizedImage.thumbnail) {
      sources.push(`${optimizedImage.thumbnail} 150w`);
      sizes.push('(max-width: 150px) 150px');
    }

    if (optimizedImage.medium) {
      sources.push(`${optimizedImage.medium} 800w`);
      sizes.push('(max-width: 800px) 800px');
    }

    if (optimizedImage.large) {
      sources.push(`${optimizedImage.large} 1200w`);
      sizes.push('(max-width: 1200px) 1200px');
    }

    // Add original as fallback
    sources.push(`${optimizedImage.original} ${optimizedImage.metadata.width}w`);
    sizes.push(`${optimizedImage.metadata.width}px`);

    return {
      src: optimizedImage.original,
      srcSet: sources.join(', '),
      sizes: sizes.join(', '),
    };
  }

  /**
   * Create a lazy loading image element
   */
  createLazyImage(
    optimizedImage: OptimizedImage,
    alt: string,
    className: string = ''
  ): HTMLImageElement {
    const img = document.createElement('img');
    const responsive = this.generateResponsiveSources(optimizedImage);

    img.src = responsive.src;
    img.srcset = responsive.srcSet;
    img.sizes = responsive.sizes;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';

    // Add WebP support if available
    if (optimizedImage.webp && this.supportsWebP()) {
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = optimizedImage.webp;
      source.type = 'image/webp';
      picture.appendChild(source);
      picture.appendChild(img);
      return picture as any; // Return picture element instead
    }

    return img;
  }

  /**
   * Compress image for upload
   */
  async compressImage(
    file: File,
    maxSizeKB: number = 500,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate dimensions to achieve target size
          const targetSize = maxSizeKB * 1024;
          const compressionRatio = Math.sqrt(targetSize / file.size);
          
          const newWidth = Math.round(img.width * compressionRatio);
          const newHeight = Math.round(img.height * compressionRatio);

          this.canvas.width = newWidth;
          this.canvas.height = newHeight;
          this.ctx.clearRect(0, 0, newWidth, newHeight);
          this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

          this.canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate image metadata
   */
  async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    aspectRatio: number;
    format: string;
    size: number;
    colorSpace?: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          format: file.type,
          size: file.size,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Export singleton instance
export const imageOptimizer = new ImageOptimizer();

// Utility functions
export const optimizeImage = (file: File, options?: ImageOptimizationOptions) =>
  imageOptimizer.optimizeImage(file, options);

export const compressImage = (file: File, maxSizeKB?: number, quality?: number) =>
  imageOptimizer.compressImage(file, maxSizeKB, quality);

export const getImageMetadata = (file: File) => imageOptimizer.getImageMetadata(file);

export const generateResponsiveSources = (optimizedImage: OptimizedImage) =>
  imageOptimizer.generateResponsiveSources(optimizedImage);

export const createLazyImage = (optimizedImage: OptimizedImage, alt: string, className?: string) =>
  imageOptimizer.createLazyImage(optimizedImage, alt, className);

// Default optimization presets
export const optimizationPresets = {
  thumbnail: {
    maxWidth: 150,
    maxHeight: 150,
    quality: 0.7,
    format: 'webp' as const,
    generateVariants: false,
  },
  medium: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8,
    format: 'webp' as const,
    generateVariants: false,
  },
  large: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    format: 'webp' as const,
    generateVariants: true,
  },
  responsive: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'auto' as const,
    generateVariants: true,
    variants: {
      thumbnail: { width: 150, height: 150, quality: 0.7 },
      medium: { width: 800, height: 600, quality: 0.8 },
      large: { width: 1200, height: 900, quality: 0.9 },
    },
  },
};
