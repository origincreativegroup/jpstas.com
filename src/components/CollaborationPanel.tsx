import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collaborator, ProjectComment } from '@/types/saas';
import saasProjectService from '@/services/saasProjectService';

interface CollaborationPanelProps {
  projectId: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ projectId }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer' | 'commenter'>('editor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborationData();
  }, [projectId]);

  const loadCollaborationData = async () => {
    try {
      setLoading(true);
      // In a real implementation, these would be separate API calls
      const project = await saasProjectService.getProject(projectId);
      if (project) {
        setCollaborators(project.collaborators || []);
      }

      const projectComments = await saasProjectService.getComments(projectId);
      setComments(projectComments);
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) return;

    try {
      const newCollaborator: Omit<Collaborator, 'id' | 'invitedAt'> = {
        userId: `user-${Date.now()}`,
        email: inviteEmail,
        name: inviteEmail.split('@')[0] || 'User',
        role: inviteRole,
        permissions: getPermissionsForRole(inviteRole),
      };

      await saasProjectService.addCollaborator(projectId, newCollaborator);
      setInviteEmail('');
      setShowInviteForm(false);
      loadCollaborationData();
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      await saasProjectService.removeCollaborator(projectId, collaboratorId);
      loadCollaborationData();
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await saasProjectService.addComment(projectId, {
        userId: 'current-user',
        content: newComment.trim(),
        resolved: false,
        replies: [],
      });
      setNewComment('');
      loadCollaborationData();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const getPermissionsForRole = (role: string): string[] => {
    switch (role) {
      case 'owner':
        return ['read', 'write', 'delete', 'share', 'admin'];
      case 'editor':
        return ['read', 'write', 'comment'];
      case 'viewer':
        return ['read'];
      case 'commenter':
        return ['read', 'comment'];
      default:
        return ['read'];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      case 'commenter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return '👑';
      case 'editor':
        return '✏️';
      case 'viewer':
        return '👁️';
      case 'commenter':
        return '💬';
      default:
        return '👤';
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
    <div className="space-y-6">
      {/* Collaborators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Team Members</h3>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="px-3 py-1 bg-accent text-brand rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            + Invite
          </button>
        </div>

        {/* Invite Form */}
        <AnimatePresence>
          {showInviteForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50"
            >
              <h4 className="font-medium mb-3">Invite Team Member</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="editor">Editor - Can edit and comment</option>
                    <option value="viewer">Viewer - Can only view</option>
                    <option value="commenter">Commenter - Can view and comment</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleInviteCollaborator}
                    className="px-4 py-2 bg-accent text-brand rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
                  >
                    Send Invite
                  </button>
                  <button
                    onClick={() => setShowInviteForm(false)}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaborators List */}
        <div className="space-y-2">
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p>No team members yet</p>
              <p className="text-sm">Invite collaborators to work together</p>
            </div>
          ) : (
            collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {collaborator.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{collaborator.name}</h4>
                    <p className="text-sm text-neutral-600">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)}`}
                  >
                    <span className="mr-1">{getRoleIcon(collaborator.role)}</span>
                    {collaborator.role}
                  </span>
                  {collaborator.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comments */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Comments & Feedback</h3>

        {/* Add Comment */}
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment or feedback..."
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-accent text-brand rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p>No comments yet</p>
              <p className="text-sm">Start a conversation with your team</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">
                      {comment.userId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">User {comment.userId}</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {comment.resolved && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{comment.content}</p>
                    {comment.position && (
                      <p className="text-xs text-neutral-500">
                        Position: {comment.position.x}, {comment.position.y}
                      </p>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 mt-3 space-y-2">
                    {comment.replies.map((reply, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">R</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-700">{reply.content}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">✏️</span>
            </div>
            <div>
              <p className="text-sm font-medium">Project updated</p>
              <p className="text-xs text-neutral-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium">New collaborator added</p>
              <p className="text-xs text-neutral-500">1 day ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm">💬</span>
            </div>
            <div>
              <p className="text-sm font-medium">Comment added</p>
              <p className="text-xs text-neutral-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;
