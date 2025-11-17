// postController.js - Controller for post routes

const Post = require('../models/Post');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Increment view count (fire and forget)
    post.incrementViewCount().catch(err => console.error('Error incrementing view count:', err));

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    // Prepare post data
    const postData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt || '',
      category: req.body.category,
      author: req.user.id,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    // Handle tags (can be array or comma-separated string)
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        postData.tags = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        postData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Handle featured image
    if (req.file) {
      postData.featuredImage = req.file.filename;
    }

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this post', 403));
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt || '',
      category: req.body.category,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    // Handle tags
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        updateData.tags = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Handle featured image
    if (req.file) {
      updateData.featuredImage = req.file.filename;
    }

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name email')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    await post.addComment(req.user.id, req.body.content);

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return next(new AppError('Please provide a search query', 400));
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

