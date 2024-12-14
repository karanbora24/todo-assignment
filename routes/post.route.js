import express from 'express';
import { auth } from '../middleware/auth.js';
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '../controllers/post.controller.js';
const router=express.Router();

// route for adding new post
router.post('/addpost', auth ,createPost);

// route for all posts
router.get('/all', auth, getAllPosts);

//route for post 
router.get('/get/:id', auth, getPostById);

//route for updated Post
router.put('/update/:id', auth, updatePost);

//route for delete post
router.delete('/delete/:id', auth, deletePost);

export default router;  