import React, { useEffect, useState } from 'react';
import { Project } from '@/services/api';

interface ProjectFormModalProps {
  initial?: Partial<Project>;
  onSubmit: (values: Partial<Project>) => Promise<void> | void;
  onClose: () => void;
  submitting?: boolean;
}

const empty: Partial<Project> = {
  title: '',
  slug: '',
  role: '',
  summary: '',
  type: 'case-study' as any,
  featured: false,
  tags: [],
  status: 'draft' as any,
  order_index: 0,
};

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ initial, onSubmit, onClose, submitting }) => {
  const [values, setValues] = useState<Partial<Project>>({ ...empty, ...initial });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setValues({ ...empty, ...initial });
  }, [initial]);

  const handleChange = (field: keyof Project, val: any) => {
    setValues(prev => ({ ...prev, [field]: val }));
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    handleChange('tags', [ ...(values.tags || []), t ] as any);
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    handleChange('tags', (values.tags || []).filter(x => x !== t) as any);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{initial?.id ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
              <input value={values.title || ''} onChange={e => handleChange('title', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
              <input value={values.slug || ''} onChange={e => handleChange('slug', e.target.value)} pattern="^[a-z0-9-]+$" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
              <input value={values.role || ''} onChange={e => handleChange('role', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
              <select value={(values.type as any) || 'case-study'} onChange={e => handleChange('type', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent">
                <option value="case-study">Case Study</option>
                <option value="project">Project</option>
                <option value="experiment">Experiment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Summary</label>
            <textarea value={values.summary || ''} onChange={e => handleChange('summary', e.target.value)} rows={3} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select value={(values.status as any) || 'draft'} onChange={e => handleChange('status', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Order</label>
              <input type="number" value={values.order_index ?? 0} onChange={e => handleChange('order_index', parseInt(e.target.value || '0'))} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent" placeholder="Add tag and press +" />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(values.tags || []).map(tag => (
                <span key={tag} className="px-2 py-1 bg-neutral-100 rounded-md text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" className="text-neutral-500 hover:text-neutral-700" onClick={() => handleRemoveTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100">Cancel</button>
            <button type="submit" disabled={!!submitting} className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">{submitting ? 'Saving...' : (initial?.id ? 'Save Changes' : 'Create Project')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
