import User from '../models/User.js';
import { getStorage } from "firebase-admin/storage"
import Post from '../models/Post.js';


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
  
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, imageUrl }) => {
        return { _id, firstName, lastName, occupation, location, imageUrl }
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, imageUrl }) => {
        return { _id, firstName, lastName, occupation, location, imageUrl }
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const fbStorage = getStorage();
    //Delete users avatar from Firebase
    const fileRef = fbStorage.bucket().file(user.imageName);
      fileRef
        .delete()
        .then(() => {
          console.log('Deleted file succesfully');
        })
          .catch(err => {
            console.error(`Failed to delete file`, err);
            return;
          });
    //Delete User
    const deletedUser = await User.findByIdAndDelete(id);
    //Delete post images from Firebase 
    const posts = await Post.find({ userId: id })
    posts.forEach((post) => {
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
    });
    //Delete users posts
    await Post.deleteMany({ userId: id })
    //Delete users id from friends
    await User.updateMany({}, {$pull: {friends: id}})
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
};


export const changeAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const newImageUrl = req.body.newImageUrl;
    const user = await User.findById(id);
    //const oldImageUrl = user.imageUrl.replace(/%20/g, ' ');
    //const fileLink = oldImageUrl;
    //const fileName = fileLink.slice(59, fbInstance.length).trimLeft();
    const fbStorage = getStorage();
    const fileRef = fbStorage.bucket().file(user.imageName);
      fileRef
        .delete()
        .then(() => {
          console.log('Deleted file succesfully');
        })
          .catch(err => {
            console.error(`Failed to delete file`, err);
            return;
          });
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {imageUrl: newImageUrl},
    {new: true}
  )
  await Post.updateMany(
    {userId : id} ,
    {userImageUrl: newImageUrl},
    {new: true}
    )
  res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};