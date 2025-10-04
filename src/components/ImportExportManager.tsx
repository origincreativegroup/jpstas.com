import { useState, useRef } from 'react';
import { ProjectImportExport, ImportOptions, ImportResult } from '@/utils/importExport';
import { Project } from '@/types/project';
import { ProjectDraft } from '@/types/project';
import { MediaFile } from '@/types/media';
import { useToast } from '@/context/ToastContext';

interface ImportExportManagerProps {
  projects: Project[];
  drafts?: ProjectDraft[];
  media?: MediaFile[];
  onImportComplete?: (result: ImportResult) => void;
  className?: string;
}

export default function ImportExportManager({
  projects,
  drafts = [],
  media = [],
  onImportComplete,
  className = '',
}: ImportExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    mergeStrategy: 'merge',
    includeMedia: true,
    includeDrafts: true,
    validateData: true,
  });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const exportData = await ProjectImportExport.exportProjects(projects, drafts, media);
      const timestamp = new Date().toISOString().split('T')[0];
      ProjectImportExport.downloadFile(exportData, `portfolio-backup-${timestamp}.json`);
      toast.success('Portfolio exported successfully');
    } catch (error) {
      toast.error(`Export failed: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await ProjectImportExport.exportProjectsCSV(projects);
      const timestamp = new Date().toISOString().split('T')[0];
      ProjectImportExport.downloadFile(csvData, `portfolio-projects-${timestamp}.csv`, 'text/csv');
      toast.success('Projects exported to CSV successfully');
    } catch (error) {
      toast.error(`CSV export failed: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      // Validate file
      const validation = ProjectImportExport.validateImportFile(file);
      if (!validation.valid) {
        toast.error(`Invalid file: ${validation.errors.join(', ')}`);
        return;
      }

      // Read file
      const fileData = await ProjectImportExport.readFile(file);
      
      // Import data
      const result = await ProjectImportExport.importProjects(fileData, importOptions);
      setImportResult(result);

      if (result.success) {
        toast.success(`Import completed: ${result.imported.projects} projects, ${result.imported.drafts} drafts, ${result.imported.media} media files`);
        onImportComplete?.(result);
      } else {
        toast.error(`Import failed: ${result.errors.join(', ')}`);
      }

      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => toast.warning(warning));
      }

    } catch (error) {
      toast.error(`Import failed: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImportFile(file);
    }
  };

  const openImportModal = () => {
    setShowImportModal(true);
    setImportResult(null);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTotalSize = () => {
    const projectsSize = projects.length * 1024; // Rough estimate
    const draftsSize = drafts.length * 1024;
    const mediaSize = media.length * 2048;
    return ProjectImportExport.formatFileSize(projectsSize + draftsSize + mediaSize);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Section */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export Data</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Export your portfolio data for backup or migration purposes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Complete Backup</h4>
                <p className="text-sm text-neutral-600">JSON format with all data</p>
              </div>
            </div>
            <div className="text-xs text-neutral-500 mb-3">
              {projects.length} projects, {drafts.length} drafts, {media.length} media files
              <br />
              Estimated size: {getTotalSize()}
            </div>
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export JSON
                </>
              )}
            </button>
          </div>

          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Projects Only</h4>
                <p className="text-sm text-neutral-600">CSV format for spreadsheets</p>
              </div>
            </div>
            <div className="text-xs text-neutral-500 mb-3">
              {projects.length} projects only
              <br />
              Compatible with Excel, Google Sheets
            </div>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Import Data</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Import portfolio data from a backup file or migrate from another system.
        </p>
        
        <button
          onClick={openImportModal}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import Data
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Import Portfolio Data</h2>
                <button
                  onClick={closeImportModal}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!importResult ? (
                <div className="space-y-6">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="w-12 h-12 mx-auto text-neutral-400 mb-4">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-neutral-700 mb-2">Select Import File</p>
                    <p className="text-sm text-neutral-500 mb-4">
                      Choose a JSON backup file or CSV file to import
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                      className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Choose File
                    </button>
                  </div>

                  {/* Import Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-neutral-900">Import Options</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Merge Strategy
                      </label>
                      <select
                        value={importOptions.mergeStrategy}
                        onChange={(e) => setImportOptions(prev => ({
                          ...prev,
                          mergeStrategy: e.target.value as any
                        }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                      >
                        <option value="replace">Replace all data</option>
                        <option value="merge">Merge with existing data</option>
                        <option value="skip">Skip duplicates</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={importOptions.includeDrafts}
                          onChange={(e) => setImportOptions(prev => ({
                            ...prev,
                            includeDrafts: e.target.checked
                          }))}
                          className="h-4 w-4 text-brand focus:ring-brand border-neutral-300 rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-700">Include drafts</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={importOptions.includeMedia}
                          onChange={(e) => setImportOptions(prev => ({
                            ...prev,
                            includeMedia: e.target.checked
                          }))}
                          className="h-4 w-4 text-brand focus:ring-brand border-neutral-300 rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-700">Include media files</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={importOptions.validateData}
                          onChange={(e) => setImportOptions(prev => ({
                            ...prev,
                            validateData: e.target.checked
                          }))}
                          className="h-4 w-4 text-brand focus:ring-brand border-neutral-300 rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-700">Validate data before import</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Import Results */
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {importResult.success ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <h3 className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        Import {importResult.success ? 'Successful' : 'Failed'}
                      </h3>
                    </div>
                    <p className={`text-sm ${importResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {importResult.success 
                        ? `Successfully imported ${importResult.imported.projects} projects, ${importResult.imported.drafts} drafts, and ${importResult.imported.media} media files.`
                        : `Import failed with ${importResult.errors.length} errors.`
                      }
                    </p>
                  </div>

                  {importResult.imported.projects > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Imported Items</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• {importResult.imported.projects} projects</li>
                        <li>• {importResult.imported.drafts} drafts</li>
                        <li>• {importResult.imported.media} media files</li>
                      </ul>
                    </div>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-800 mb-2">Errors</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Warnings</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {importResult.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-end gap-3">
                {importResult ? (
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Close
                  </button>
                ) : (
                  <button
                    onClick={closeImportModal}
                    className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
