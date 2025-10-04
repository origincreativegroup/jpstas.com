import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectVersion } from '@/types/saas';
import saasProjectService from '@/services/saasProjectService';

interface VersionHistoryProps {
  projectId: string;
  onRestoreVersion?: (version: ProjectVersion) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  projectId,
  onRestoreVersion
}) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [projectId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const projectVersions = await saasProjectService.getVersions(projectId);
      setVersions(projectVersions);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (version: ProjectVersion) => {
    try {
      await saasProjectService.restoreVersion(projectId, version.id);
      onRestoreVersion?.(version);
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'move':
        return '↔️';
      case 'style':
        return '🎨';
      case 'content':
        return '📝';
      default:
        return '📝';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'move':
        return 'bg-yellow-100 text-yellow-800';
      case 'style':
        return 'bg-purple-100 text-purple-800';
      case 'content':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Version History</h3>
        <span className="text-sm text-neutral-500">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <p>No versions yet</p>
          <p className="text-sm">Versions will appear as you make changes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedVersion?.id === version.id
                  ? 'border-accent bg-accent/5'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">v{version.version}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{version.title}</h4>
                    <p className="text-sm text-neutral-600">{version.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">{formatDate(version.createdAt)}</p>
                  <p className="text-xs text-neutral-400">by {version.createdBy}</p>
                </div>
              </div>

              {version.changes && version.changes.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">Changes:</span>
                    <span className="text-sm text-neutral-500">
                      {version.changes.length} change{version.changes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {version.changes.slice(0, 3).map((change, changeIndex) => (
                      <span
                        key={changeIndex}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(change.type)}`}
                      >
                        <span className="mr-1">{getChangeTypeIcon(change.type)}</span>
                        {change.type}
                      </span>
                    ))}
                    {version.changes.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                        +{version.changes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  {index === 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Current
                    </span>
                  )}
                  {version.changes && version.changes.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChanges(!showChanges);
                      }}
                      className="text-sm text-accent hover:text-accent-dark transition-colors"
                    >
                      {showChanges ? 'Hide' : 'Show'} details
                    </button>
                  )}
                </div>
                {index !== 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreVersion(version);
                    }}
                    className="px-3 py-1 bg-accent text-brand rounded text-sm font-medium hover:bg-accent-dark transition-colors"
                  >
                    Restore
                  </button>
                )}
              </div>

              {/* Detailed Changes */}
              <AnimatePresence>
                {selectedVersion?.id === version.id && showChanges && version.changes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-neutral-200"
                  >
                    <h5 className="font-medium mb-3">Detailed Changes</h5>
                    <div className="space-y-3">
                      {version.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <span className="text-lg">{getChangeTypeIcon(change.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(change.type)}`}>
                                {change.type}
                              </span>
                              <span className="text-xs text-neutral-500">{change.section}</span>
                            </div>
                            <p className="text-sm text-neutral-700 mb-1">{change.description}</p>
                            <p className="text-xs text-neutral-500">
                              {formatDate(change.timestamp)} by {change.userId}
                            </p>
                            
                            {/* Show before/after if available */}
                            {(change.before || change.after) && (
                              <div className="mt-2 space-y-1">
                                {change.before && (
                                  <div className="text-xs">
                                    <span className="font-medium text-red-600">Before:</span>
                                    <span className="ml-2 text-neutral-600 line-through">
                                      {typeof change.before === 'string' ? change.before : JSON.stringify(change.before)}
                                    </span>
                                  </div>
                                )}
                                {change.after && (
                                  <div className="text-xs">
                                    <span className="font-medium text-green-600">After:</span>
                                    <span className="ml-2 text-neutral-600">
                                      {typeof change.after === 'string' ? change.after : JSON.stringify(change.after)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Version Statistics */}
      {versions.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium mb-3">Version Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Total Versions:</span>
              <span className="ml-2 font-medium">{versions.length}</span>
            </div>
            <div>
              <span className="text-neutral-600">Latest Update:</span>
              <span className="ml-2 font-medium">{formatDate(versions[0]?.createdAt || '')}</span>
            </div>
            <div>
              <span className="text-neutral-600">Total Changes:</span>
              <span className="ml-2 font-medium">
                {versions.reduce((total, version) => total + (version.changes?.length || 0), 0)}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Most Active:</span>
              <span className="ml-2 font-medium">
                {versions.reduce((acc, version) => {
                  const changes = version.changes?.length || 0;
                  return changes > acc ? changes : acc;
                }, 0)} changes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
