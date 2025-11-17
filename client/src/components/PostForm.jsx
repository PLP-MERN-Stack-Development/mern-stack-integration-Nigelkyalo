// PostForm.jsx - Component for creating/editing posts

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { useApi } from '../hooks/useApi';
import './PostForm.css';

const PostForm = ({ postId, postData }) => {
  const navigate = useNavigate();
  const { execute, loading, error } = useApi();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
    featuredImage: null,
  });

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      const { data } = await execute(() => categoryService.getAllCategories());
      if (data) {
        setCategories(data.data || []);
      }
    };
    loadCategories();

    // If editing, load post data
    if (postId && postData) {
      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        category: postData.category?._id || postData.category || '',
        tags: postData.tags?.join(', ') || '',
        isPublished: postData.isPublished || false,
        featuredImage: null,
      });
    }
  }, [postId, postData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('category', formData.category);
    submitData.append('isPublished', formData.isPublished);
    
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      tagsArray.forEach(tag => submitData.append('tags', tag));
    }

    if (formData.featuredImage) {
      submitData.append('featuredImage', formData.featuredImage);
    }

    if (postId) {
      // Update post
      const { data, error: submitError } = await execute(() =>
        postService.updatePost(postId, submitData)
      );
      if (data && !submitError) {
        navigate(`/posts/${postId}`);
      }
    } else {
      // Create post
      const { data, error: submitError } = await execute(() =>
        postService.createPost(submitData)
      );
      if (data && !submitError) {
        navigate('/');
      }
    }
  };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit} className="post-form">
        <h2>{postId ? 'Edit Post' : 'Create New Post'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., react, javascript, web"
          />
        </div>

        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Publish immediately
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;


