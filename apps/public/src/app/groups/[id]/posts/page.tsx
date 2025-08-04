'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  Modal, 
  Input, 
  Textarea, 
  Badge, 
  LoadingSpinner,
  Alert,
  Avatar,
  AvatarGroup
} from '@3de/ui';
import { groupApi, postApi } from '@3de/apis';
import { Group, Post, User, Comment } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Trash2, 
  Edit, 
  MoreVertical,
  Calendar,
  User as UserIcon
} from 'lucide-react';

export default function GroupPostsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const groupId = params.id as string;
  
  // State
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    image: ''
  });

  // Fetch group details
  const { data: groupData, isLoading: groupLoading, error: groupError } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupApi.getById(groupId),
    enabled: !!groupId,
  });

  // Fetch group posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['group-posts', groupId],
    queryFn: () => groupApi.getPosts(groupId),
    enabled: !!groupId,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string; image?: string }) =>
      postApi.create({ ...data, authorId: user?.id || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setIsCreatePostModalOpen(false);
      setPostFormData({ title: '', content: '', image: '' });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setIsDeletePostModalOpen(false);
      setSelectedPost(null);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      postApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setIsDeleteCommentModalOpen(false);
      setSelectedComment(null);
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      postApi.like(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
    },
  });

  // Unlike post mutation
  const unlikePostMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      postApi.unlike(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
    },
  });

  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      createPostMutation.mutate(postFormData);
    }
  };

  // Handle delete post
  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setIsDeletePostModalOpen(true);
  };

  // Handle delete comment
  const handleDeleteComment = (post: Post, comment: Comment) => {
    setSelectedPost(post);
    setSelectedComment(comment);
    setIsDeleteCommentModalOpen(true);
  };

  // Handle like/unlike post
  const handleLikePost = (post: Post) => {
    if (!user?.id) return;
    
    const isLiked = post.likes?.some(like => like.userId === user.id);
    if (isLiked) {
      unlikePostMutation.mutate({ postId: post.id, userId: user.id });
    } else {
      likePostMutation.mutate({ postId: post.id, userId: user.id });
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Check if user can delete post
  const canDeletePost = (post: Post) => {
    return user?.id === post.authorId || user?.role === 'ADMIN';
  };

  // Check if user can delete comment
  const canDeleteComment = (comment: Comment) => {
    return user?.id === comment.authorId || user?.role === 'ADMIN';
  };

  if (groupLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (groupError || postsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في التحميل">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
    );
  }

  const group = groupData?.data;
  const posts = postsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {group?.name || 'المجتمع'}
            </h1>
            <p className="text-gray-600 mt-2">
              {group?.subject || 'عرض البوستات والتعليقات'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          إنشاء بوست جديد
        </Button>
      </div>

      {/* Group Info Card */}
      {group && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4">
              {group.image && (
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
                <p className="text-gray-600">{group.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {group.members?.length || 0} عضو
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(group.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بوستات</h3>
              <p className="text-gray-600">كن أول من ينشر بوست في هذا المجتمع!</p>
            </div>
          </Card>
        ) : (
          posts.map((post: Post) => (
            <Card key={post.id} className="overflow-hidden">
              {/* Post Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={post.author?.avatar}
                      alt={post.author?.firstName || 'مستخدم'}
                      size="md"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.author?.firstName} {post.author?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  {canDeletePost(post) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">
                  {post.content}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-lg object-cover max-h-96"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post)}
                      className={`flex items-center gap-2 ${
                        post.likes?.some(like => like.userId === user?.id)
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        post.likes?.some(like => like.userId === user?.id)
                          ? 'fill-current'
                          : ''
                      }`} />
                      {post.likesCount || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-gray-500"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.comments?.length || 0} تعليق
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="border-t bg-gray-50">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">التعليقات</h4>
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-3">
                            <Avatar
                              src={comment.author?.avatar}
                              alt={comment.author?.firstName || 'مستخدم'}
                              size="sm"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {comment.author?.firstName} {comment.author?.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString('ar-SA')}
                                  </div>
                                </div>
                                {canDeleteComment(comment) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteComment(post, comment)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-gray-700 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        لا توجد تعليقات بعد
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        title="إنشاء بوست جديد"
      >
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان *
            </label>
            <Input
              type="text"
              value={postFormData.title}
              onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
              placeholder="أدخل عنوان البوست"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المحتوى *
            </label>
            <Textarea
              value={postFormData.content}
              onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
              placeholder="أدخل محتوى البوست"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الصورة
            </label>
            <Input
              type="url"
              value={postFormData.image}
              onChange={(e) => setPostFormData({ ...postFormData, image: e.target.value })}
              placeholder="أدخل رابط الصورة (اختياري)"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreatePostModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'نشر البوست'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Post Confirmation Modal */}
      <Modal
        isOpen={isDeletePostModalOpen}
        onClose={() => setIsDeletePostModalOpen(false)}
        title="تأكيد حذف البوست"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            هل أنت متأكد من حذف البوست "{selectedPost?.title}"؟ 
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeletePostModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={() => selectedPost && deletePostMutation.mutate(selectedPost.id)}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'حذف البوست'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Comment Confirmation Modal */}
      <Modal
        isOpen={isDeleteCommentModalOpen}
        onClose={() => setIsDeleteCommentModalOpen(false)}
        title="تأكيد حذف التعليق"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            هل أنت متأكد من حذف التعليق؟ 
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteCommentModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (selectedPost && selectedComment) {
                  deleteCommentMutation.mutate({
                    postId: selectedPost.id,
                    commentId: selectedComment.id
                  });
                }
              }}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'حذف التعليق'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 