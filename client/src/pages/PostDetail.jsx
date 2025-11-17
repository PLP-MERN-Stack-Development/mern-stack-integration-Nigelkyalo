// PostDetail.jsx - Single post detail page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { execute, loading, error } = useApi();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    const { data } = await execute(() => postService.getPost(id));
    if (data) {
      setPost(data.data);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error: deleteError } = await execute(() =>
        postService.deletePost(id)
      );
      if (!deleteError) {
        navigate('/');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    const { data, error: commentError } = await execute(() =>
      postService.addComment(id, { content: commentContent })
    );
    if (data && !commentError) {
      setPost(data.data);
      setCommentContent('');
    }
  };

  if (loading && !post) {
    return <div className="loading">Loading post...</div>;
  }

  if (error && !post) {
    return <div className="error">Error: {error}</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = isAuthenticated && (user?.id === post.author?._id || user?.role === 'admin');

  return (
    <div className="post-detail">
      <div className="container">
        <Link to="/" className="back-link">
          ← Back to Posts
        </Link>

        <article className="post-article">
          {post.featuredImage && (
            <div className="post-featured-image">
              <img
                src={`http://localhost:5000/uploads/${post.featuredImage}`}
                alt={post.title}
              />
            </div>
          )}

          <div className="post-header">
            <div className="post-meta">
              <span className="post-category">{post.category?.name}</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            <h1>{post.title}</h1>
            <div className="post-author-info">
              <span>By {post.author?.name}</span>
              <span className="post-views">{post.viewCount} views</span>
            </div>
          </div>

          {canEdit && (
            <div className="post-actions">
              <Link to={`/posts/${id}/edit`} className="btn btn-primary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}

          <div className="post-content">
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            <div className="post-body">{post.content}</div>
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({post.comments?.length || 0})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                required
              />
              <button type="submit" className="btn btn-primary">
                Add Comment
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to add a comment
            </p>
          )}

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user?.name || 'Anonymous'}</strong>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;


