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
     * Show the media library interface
     */
    show: function(options = {}) {
      console.log('R2 Media Library show called with options:', options);
      
      // Create a simple media library interface
      const mediaLibrary = document.createElement('div');
      mediaLibrary.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px;
        max-height: 600px;
        overflow: auto;
      `;
      
      modal.innerHTML = `
        <h2>R2 Media Library</h2>
        <div id="r2-media-list"></div>
        <input type="file" id="r2-upload" multiple>
        <button onclick="window.R2MediaLibrary.hide()">Close</button>
      `;
      
      mediaLibrary.appendChild(modal);
      document.body.appendChild(mediaLibrary);
      
      // Load existing media
      this.loadMediaList();
      
      // Handle file uploads
      document.getElementById('r2-upload').addEventListener('change', (e) => {
        this.handleUpload(e.target.files);
      });
      
      return Promise.resolve();
    },
    
    /**
     * Hide the media library interface
     */
    hide: function() {
      const mediaLibrary = document.querySelector('div[style*="position: fixed"]');
      if (mediaLibrary) {
        document.body.removeChild(mediaLibrary);
      }
      return Promise.resolve();
    },
    
    /**
     * Load media list
     */
    loadMediaList: async function() {
      try {
        const response = await fetch(`${R2_API_BASE}/list`);
        const data = await response.json();
        
        const list = document.getElementById('r2-media-list');
        if (list) {
          list.innerHTML = data.files.map(file => `
            <div style="border: 1px solid #ccc; margin: 5px; padding: 10px;">
              <img src="${file.url}" style="max-width: 100px; max-height: 100px;" />
              <p>${file.filename}</p>
              <button onclick="window.R2MediaLibrary.selectMedia('${file.url}')">Select</button>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Failed to load media list:', error);
      }
    },
    
    /**
     * Handle file uploads
     */
    handleUpload: async function(files) {
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('path', 'portfolio');
          
          const response = await fetch(`${R2_API_BASE}/upload`, {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            console.log('File uploaded:', file.name);
            this.loadMediaList(); // Refresh the list
          }
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    },
    
    /**
     * Select media and return URL
     */
    selectMedia: function(url) {
      // This would typically trigger the CMS to use the selected media
      console.log('Media selected:', url);
      this.hide();
      
      // Trigger a custom event that the CMS can listen for
      window.dispatchEvent(new CustomEvent('r2-media-selected', { detail: { url } }));
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
    }
  };
  
  // Register media library when CMS is ready (prevent duplicate registration)
  function registerR2MediaLibrary() {
    if (window.CMS && window.CMS.getMediaLibrary && !window.CMS.getMediaLibrary('r2')) {
      window.CMS.registerMediaLibrary(R2MediaLibrary);
      console.log('R2 Media Library registered with Decap CMS');
      return true;
    }
    return false;
  }

  // Try to register immediately if CMS is available
  if (window.CMS) {
    registerR2MediaLibrary();
  } else {
    // Wait for CMS to load
    const checkCMS = setInterval(function() {
      if (registerR2MediaLibrary()) {
        clearInterval(checkCMS);
      }
    }, 100);
    
    // Also try on DOMContentLoaded as backup
    document.addEventListener('DOMContentLoaded', function() {
      registerR2MediaLibrary();
    });
  }
  
  // Also expose globally for debugging
  window.R2MediaLibrary = R2MediaLibrary;
})();