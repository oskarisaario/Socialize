import { Box } from '@mui/material';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index.js";
import PostWidget from './PostWidget';



const PostsWidget = ({ userId, isProfile = false, socket }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state ) => state.token);
  const [isLoading, setLoading] = useState(true);


  const getPosts = async () => {
    const response = await fetch('http://localhost:3001/posts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setLoading(false);
  };


  const getUserPosts = async () => {
    const response = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setLoading(false);
  };


  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }   
  }, [posts.length]) //eslint-disable-line react-hooks/exhaustive-deps


  if (isLoading) {
    return;
  };

  return(
    <>
    {posts.map(
      ({
        _id,
        userId,
        firstName,
        lastName,
        description,
        location,
        imageUrl,
        userImageUrl,
        likes,
        comments,
      }) =>
      <Box key={_id}>
        <PostWidget
          postId={_id}
          postUserId={userId}
          name={`${firstName} ${lastName}`}
          description={description}
          location={location}
          imageUrl={imageUrl}
          userImageUrl={userImageUrl}
          likes={likes}
          comments={comments}
          socket={socket}
        />
        <Box mb='2rem' />
      </Box>
    )}
    </>
  )
};


export default PostsWidget;