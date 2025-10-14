/**
 * Custom R2 Media Backend for Decap CMS
 * Integrates Cloudflare R2 storage with the CMS media library
 */

(function() {
  'use strict';
  
  const R2_API_BASE = '/api/cms/media';
  
  // Custom R2 Media Library
  const R2MediaLibrary = {
    name: 'r2',
    
    /**
     * Initialize the media library
     */
    init: function() {
      console.log('R2 Media Library initialized');
      return Promise.resolve();
    },
    
    /**
     * Upload handler - uploads file to R2 via API
     */
    upload: async function(file, path) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add folder path if provided
        if (path) {
          formData.append('path', path);
        } else {
          // Default to portfolio folder
          formData.append('path', 'portfolio');
        }
        
        const response = await fetch(`${R2_API_BASE}/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }
        
        const data = await response.json();
        
        return {
          id: data.key,
          name: data.filename,
          size: data.size,
          url: data.url,
          path: data.path,
          uploadedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('R2 upload error:', error);
        throw error;
      }
    },
    
    /**
     * List media files
     */
    list: async function(options = {}) {
      try {
        const params = new URLSearchParams({
          prefix: options.folder || 'portfolio',
          limit: options.limit || 100,
          offset: options.offset || 0
        });
        
        const response = await fetch(`${R2_API_BASE}/list?${params}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to list media files');
        }
        
        const data = await response.json();
        
        return {
          items: data.files.map(file => ({
            id: file.key,
            name: file.filename,
            size: file.size,
            url: file.url,
            path: file.key,
            uploadedAt: file.uploaded
          })),
          hasMore: data.hasMore
        };
      } catch (error) {
        console.error('R2 list error:', error);
        return { items: [], hasMore: false };
      }
    },
    
    /**
     * Delete a media file
     */
    delete: async function(fileId) {
      try {
        const response = await fetch(`${R2_API_BASE}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key: fileId }),
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete file');
        }
        
        return true;
      } catch (error) {
        console.error('R2 delete error:', error);
        throw error;
      }
    },
    
    /**
     * Get file details
     */
    getFile: async function(fileId) {
      try {
        const response = await fetch(`${R2_API_BASE}/file?key=${encodeURIComponent(fileId)}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('File not found');
        }
        
        const data = await response.json();
        
        return {
          id: data.key,
          name: data.filename,
          size: data.size,
          url: data.url,
          path: data.key,
          uploadedAt: data.uploaded
        };
      } catch (error) {
        console.error('R2 getFile error:', error);
        throw error;
      }
    }
  };
  
  // Register media library when CMS is ready
  if (window.CMS) {
    window.CMS.registerMediaLibrary(R2MediaLibrary);
    console.log('R2 Media Library registered with Decap CMS');
  } else {
    // Wait for CMS to load
    document.addEventListener('DOMContentLoaded', function() {
      if (window.CMS) {
        window.CMS.registerMediaLibrary(R2MediaLibrary);
        console.log('R2 Media Library registered with Decap CMS');
      }
    });
  }
  
  // Also expose globally for debugging
  window.R2MediaLibrary = R2MediaLibrary;
})();

