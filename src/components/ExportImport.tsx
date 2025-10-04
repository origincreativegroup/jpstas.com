import React, { useState, useRef } from 'react';
import { ProjectDraft, ProjectExport, ProjectImport } from '@/types/saas';
import saasProjectService from '@/services/saasProjectService';

interface ExportImportProps {
  project: ProjectDraft;
  onImport?: (project: ProjectDraft) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({
  project,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'json' | 'html' | 'pdf' | 'zip'>('json');
  const [importFormat, setImportFormat] = useState<'json' | 'html' | 'zip'>('json');
  const [exports, setExports] = useState<ProjectExport[]>([]);
  const [imports, setImports] = useState<ProjectImport[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      const exportData = await saasProjectService.exportProject(project.id, exportFormat);
      setExports(prev => [exportData, ...prev]);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      const importData = await saasProjectService.importProject(file, importFormat);
      setImports(prev => [importData, ...prev]);
      
      if (importData.status === 'completed' && importData.result) {
        onImport?.(importData.result);
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return '📄';
      case 'html':
        return '🌐';
      case 'pdf':
        return '📕';
      case 'zip':
        return '📦';
      default:
        return '📄';
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-neutral-200">
        {[
          { id: 'export', label: 'Export', icon: '📤' },
          { id: 'import', label: 'Import', icon: '📥' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-accent text-brand border-b-2 border-accent'
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Export Project</h3>
            <p className="text-neutral-600 mb-6">
              Export your project in various formats for backup, sharing, or deployment.
            </p>

            {/* Format Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Choose Export Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'json', label: 'JSON Data', description: 'Raw project data for backup and migration' },
                  { id: 'html', label: 'HTML Website', description: 'Static HTML website ready for deployment' },
                  { id: 'pdf', label: 'PDF Document', description: 'Print-ready PDF document' },
                  { id: 'zip', label: 'ZIP Package', description: 'Complete project package with assets' }
                ].map(format => (
                  <div
                    key={format.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      exportFormat === format.id
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setExportFormat(format.id as any)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFormatIcon(format.id)}</span>
                      <div>
                        <h5 className="font-medium">{format.label}</h5>
                        <p className="text-sm text-neutral-600">{format.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div className="mt-6">
              <button
                onClick={handleExport}
                disabled={loading}
                className="px-6 py-3 bg-accent text-brand rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand border-t-transparent"></div>
                    <span>Exporting...</span>
                  </div>
                ) : (
                  `Export as ${exportFormat.toUpperCase()}`
                )}
              </button>
            </div>
          </div>

          {/* Export History */}
          {exports.length > 0 && (
            <div>
              <h4 className="font-medium mb-4">Recent Exports</h4>
              <div className="space-y-2">
                {exports.slice(0, 5).map(exportItem => (
                  <div key={exportItem.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFormatIcon(exportItem.format)}</span>
                      <div>
                        <p className="font-medium">{exportItem.format.toUpperCase()} Export</p>
                        <p className="text-sm text-neutral-600">{formatDate(exportItem.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exportItem.status)}`}>
                        {exportItem.status}
                      </span>
                      {exportItem.downloadUrl && (
                        <a
                          href={exportItem.downloadUrl}
                          download
                          className="px-3 py-1 bg-accent text-brand rounded text-sm font-medium hover:bg-accent-dark transition-colors"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Import Project</h3>
            <p className="text-neutral-600 mb-6">
              Import a project from a file to create a new project or merge with existing content.
            </p>

            {/* Format Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Select Import Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'json', label: 'JSON Data', description: 'Import from JSON project file' },
                  { id: 'html', label: 'HTML Website', description: 'Import from HTML file' },
                  { id: 'zip', label: 'ZIP Package', description: 'Import from ZIP package' }
                ].map(format => (
                  <div
                    key={format.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      importFormat === format.id
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setImportFormat(format.id as any)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFormatIcon(format.id)}</span>
                      <div>
                        <h5 className="font-medium">{format.label}</h5>
                        <p className="text-sm text-neutral-600">{format.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <div
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📁</span>
                </div>
                <h4 className="font-medium mb-2">Choose File to Import</h4>
                <p className="text-sm text-neutral-600 mb-4">
                  Select a {importFormat.toUpperCase()} file to import
                </p>
                <button className="px-4 py-2 bg-accent text-brand rounded-lg font-medium hover:bg-accent-dark transition-colors">
                  Browse Files
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={`.${importFormat}`}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Import History */}
          {imports.length > 0 && (
            <div>
              <h4 className="font-medium mb-4">Recent Imports</h4>
              <div className="space-y-2">
                {imports.slice(0, 5).map(importItem => (
                  <div key={importItem.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFormatIcon(importItem.format)}</span>
                      <div>
                        <p className="font-medium">{importItem.file.name}</p>
                        <p className="text-sm text-neutral-600">
                          {formatFileSize(importItem.file.size)} • {formatDate(importItem.createdAt)}
                        </p>
                        {importItem.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {importItem.errors.length} error{importItem.errors.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(importItem.status)}`}>
                        {importItem.status}
                      </span>
                      {importItem.status === 'completed' && importItem.result && (
                        <button
                          onClick={() => onImport?.(importItem.result!)}
                          className="px-3 py-1 bg-accent text-brand rounded text-sm font-medium hover:bg-accent-dark transition-colors"
                        >
                          Use Project
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Import Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• JSON files should contain valid project data structure</li>
              <li>• HTML files will be parsed to extract content and structure</li>
              <li>• ZIP files should contain a complete project package</li>
              <li>• Large files may take longer to process</li>
              <li>• Imported projects will be created as new drafts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportImport;
