import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

interface NavigationEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export default function NavigationEditor({ onSave, onCancel }: NavigationEditorProps) {
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, load from localStorage or use default navigation
      const stored = localStorage.getItem('site_navigation');
      if (stored) {
        setNavigation(JSON.parse(stored));
      } else {
        // Default navigation structure
        setNavigation([
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'About', href: '/about' },
          { id: '3', label: 'Portfolio', href: '/portfolio' },
          { id: '4', label: 'Resume', href: '/resume' },
          { id: '5', label: 'Contact', href: '/contact' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load navigation:', err);
      setError('Failed to load navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Save to localStorage for now
      localStorage.setItem('site_navigation', JSON.stringify(navigation));
      
      // TODO: Save to API when CMS endpoint is available
      // await api.updateNavigation(navigation);
      
      setHasChanges(false);
      onSave?.();
    } catch (err) {
      console.error('Failed to save navigation:', err);
      setError('Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    const newItem: NavItem = {
      id: Date.now().toString(),
      label: 'New Item',
      href: '/'
    };
    
    setNavigation(prev => [...prev, newItem]);
    setHasChanges(true);
  };

  const updateNavItem = (id: string, field: keyof NavItem, value: string) => {
    setNavigation(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value }
          : item
      )
    );
    setHasChanges(true);
  };

  const removeNavItem = (id: string) => {
    setNavigation(prev => prev.filter(item => item.id !== id));
    setHasChanges(true);
  };

  const moveNavItem = (dragId: string, hoverId: string) => {
    setNavigation(prev => {
      const dragIndex = prev.findIndex(item => item.id === dragId);
      const hoverIndex = prev.findIndex(item => item.id === hoverId);
      
      if (dragIndex === -1 || hoverIndex === -1) return prev;
      
      const newItems = [...prev];
      const draggedItem = newItems[dragIndex];
      if (!draggedItem) return prev;
      
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      
      return newItems;
    });
    setHasChanges(true);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetId) {
      moveNavItem(draggedItem, targetId);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading navigation...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Navigation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your site's navigation menu
          </p>
        </div>
        
        {hasChanges && (
          <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Navigation Items */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Navigation Items</h3>
            <button
              onClick={addNavItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {navigation.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                draggedItem === item.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                </div>

                {/* Item Number */}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Menu label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateNavItem(item.id, 'href', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="/path"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (optional)
                    </label>
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => updateNavItem(item.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="🏠"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeNavItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {navigation.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No navigation items</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first navigation item.</p>
            <button
              onClick={addNavItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Add Navigation Item
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {navigation.length > 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <nav className="flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Navigation'}
          </button>
        </div>
      </div>
    </div>
  );
}
