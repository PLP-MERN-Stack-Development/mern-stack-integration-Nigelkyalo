// PostCard.jsx - Component for displaying a post card

import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="post-card">
      {post.featuredImage && (
        <div className="post-image">
          <img
            src={`http://localhost:5000/uploads/${post.featuredImage}`}
            alt={post.title}
          />
        </div>
      )}
      <div className="post-content">
        <div className="post-meta">
          <span className="post-category">{post.category?.name}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        <h2 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        <div className="post-footer">
          <span className="post-author">By {post.author?.name}</span>
          <span className="post-views">{post.viewCount} views</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;


