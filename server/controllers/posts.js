import Post from '../models/Post.js';
import User from '../models/User.js';
import { getStorage } from "firebase-admin/storage"



export const  createPost = async (req, res) => {
  try {
    const { userId, description, imageUrl, imageName } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userImageUrl: user.imageUrl,
      imageUrl,
      imageName, 
      likes: {},
      comments: []
    })
    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const deletePost = async(req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const userId = post.userId;
    //const isImageUrl = await Post.findById(postId, {imageUrl:{$exists:true}});
    //if (isImageUrl) {
      const fbStorage = getStorage();
      const fileRef = fbStorage.bucket().file(post.imageName);
        fileRef
          .delete()
          .then(() => {
            console.log('Deleted file succesfully');
          })
            .catch(err => {
              console.error(`Failed to delete file`, err);
              return;
            });
    //}
    await Post.findByIdAndDelete(postId)
    const userPosts = await Post.find({ userId })
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body
    const post = await Post.findById(postId);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: {comments: comment}
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};