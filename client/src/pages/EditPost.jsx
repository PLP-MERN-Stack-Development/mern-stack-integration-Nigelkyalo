// EditPost.jsx - Edit post page

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';
import { useApi } from '../hooks/useApi';
import PostForm from '../components/PostForm';

const EditPost = () => {
  const { id } = useParams();
  const { execute, loading, error } = useApi();
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    const { data } = await execute(() => postService.getPost(id));
    if (data) {
      setPostData(data.data);
    }
  };

  if (loading && !postData) {
    return <div className="loading">Loading post...</div>;
  }

  if (error && !postData) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        {postData && <PostForm postId={id} postData={postData} />}
      </div>
    </div>
  );
};

export default EditPost;


