// Home.jsx - Home page component

import React, { useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import { useApi } from '../hooks/useApi';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const { execute, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, [currentPage, selectedCategory]);

  const loadPosts = async () => {
    const { data } = await execute(() =>
      postService.getAllPosts(currentPage, 10, selectedCategory || null)
    );
    if (data) {
      setPosts(data.data || []);
      setTotalPages(data.pages || 1);
    }
  };

  const loadCategories = async () => {
    const { data } = await execute(() => categoryService.getAllCategories());
    if (data) {
      setCategories(data.data || []);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const { data } = await execute(() =>
        postService.searchPosts(searchQuery)
      );
      if (data) {
        setPosts(data.data || []);
        setTotalPages(1);
      }
    } else {
      loadPosts();
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-header">
          <h1>Welcome to MERN Blog</h1>
          <p>Discover amazing articles and stories</p>
        </div>

        <div className="home-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="category-filters">
            <button
              className={`category-filter ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-filter ${
                  selectedCategory === cat._id ? 'active' : ''
                }`}
                onClick={() => handleCategoryFilter(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="no-posts">No posts found</div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


