# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js. This application demonstrates seamless integration between front-end and back-end components, including database operations, API communication, and state management.

## 🚀 Features

### Core Features
- **User Authentication**: Registration, login, and protected routes
- **Blog Posts**: Full CRUD operations for blog posts
- **Categories**: Create and manage post categories
- **Comments**: Add comments to blog posts
- **Image Uploads**: Upload featured images for blog posts
- **Search & Filter**: Search posts and filter by category
- **Pagination**: Navigate through posts with pagination
- **Responsive Design**: Modern, mobile-friendly UI

### Advanced Features
- JWT-based authentication
- Protected routes and role-based access control
- Image upload with Multer
- Optimistic UI updates
- Loading and error state handling
- Form validation on both client and server

## 📁 Project Structure

```
mern-stack-integration-Nigelkyalo/
├── client/                      # React front-end
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useApi.js
│   │   │   └── useAuth.js
│   │   ├── context/             # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/            # API services
│   │   │   └── api.js
│   │   ├── App.jsx              # Main application component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/                       # Express.js back-end
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   │   ├── postController.js
│   │   ├── categoryController.js
│   │   └── authController.js
│   ├── models/                  # Mongoose models
│   │   ├── Post.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   ├── posts.js
│   │   ├── categories.js
│   │   └── auth.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/                   # Utility functions
│   │   └── upload.js
│   ├── uploads/                 # Uploaded images
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env.example
├── README.md
└── Week4-Assignment.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-stack-integration-Nigelkyalo
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables for server**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your MongoDB URI and JWT secret
   ```

4. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

5. **Set up environment variables for client**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env if needed (default should work for local development)
   ```

### Running the Application

1. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - If using MongoDB Atlas, ensure your connection string is correct

2. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

3. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:3000`

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Post Endpoints

#### Get All Posts
```http
GET /api/posts?page=1&limit=10&category=category_id
```

#### Get Single Post
```http
GET /api/posts/:id
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Post Title"
content: "Post content here"
excerpt: "Short excerpt"
category: "category_id"
tags: "tag1, tag2"
isPublished: true
featuredImage: <file>
```

#### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

#### Add Comment
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Comment text here"
}
```

#### Search Posts
```http
GET /api/posts/search?q=search_query
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

#### Get Single Category
```http
GET /api/categories/:id
```

#### Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category description"
}
```

#### Update Category (Admin Only)
```http
PUT /api/categories/:id
Authorization: Bearer <token>
```

#### Delete Category (Admin Only)
```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

## 🎯 Features Implemented

### Task 1: Project Setup ✅
- ✅ Clear directory structure for both client and server
- ✅ MongoDB connection using Mongoose
- ✅ Express.js server with necessary middleware
- ✅ React front-end using Vite
- ✅ Proxy configuration for API calls
- ✅ Environment variables for configuration

### Task 2: Back-End Development ✅
- ✅ RESTful API with all required endpoints
- ✅ Mongoose models for Post, Category, and User
- ✅ Input validation using express-validator
- ✅ Error handling middleware
- ✅ File upload support with Multer

### Task 3: Front-End Development ✅
- ✅ React components (PostCard, PostForm, Navbar, etc.)
- ✅ React Router for navigation
- ✅ React hooks (useState, useEffect, useContext)
- ✅ Custom hooks (useApi, useAuth)

### Task 4: Integration and Data Flow ✅
- ✅ API service for backend communication
- ✅ State management with Context API
- ✅ Form validation
- ✅ Loading and error states
- ✅ Optimistic UI updates

### Task 5: Advanced Features ✅
- ✅ User authentication (registration, login, protected routes)
- ✅ Image uploads for featured images
- ✅ Pagination for post list
- ✅ Search and filtering functionality
- ✅ Comments feature for blog posts

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user logs in or registers, they receive a token that must be included in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

Tokens are stored in localStorage and automatically included in API requests.

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client and server-side validation
- **Optimistic Updates**: Immediate UI feedback

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

1. **Register a new user** at `/register`
2. **Login** at `/login`
3. **Create a post** (requires authentication)
4. **Browse posts** on the home page
5. **View post details** by clicking on a post
6. **Add comments** to posts (requires authentication)
7. **Search posts** using the search bar
8. **Filter by category** using category buttons
9. **Edit/Delete posts** (only your own posts or if admin)

## 📸 Screenshots

_Add screenshots of your application here showing:_
- Home page with posts
- Post detail page
- Create/Edit post form
- Login/Register pages
- Search and filter functionality

## 🚧 Future Enhancements

- [ ] Rich text editor for post content
- [ ] Post likes/favorites
- [ ] User profiles
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Admin dashboard
- [ ] Post drafts
- [ ] Tag management
- [ ] RSS feed

## 📚 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- multer
- cors
- dotenv

### Frontend
- React
- React Router
- Axios
- Vite
- CSS3

## 🤝 Contributing

This is an assignment project. For questions or issues, please contact the instructor.

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Nigel Kyalo

---

**Note**: Make sure to update the MongoDB URI and JWT secret in your `.env` files before running the application in production.
