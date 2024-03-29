import { 
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  AddCommentOutlined
} from "@mui/icons-material";
import { 
  Box,
  Divider,
  IconButton,
  Typography,
  InputBase,
  useTheme,  
} from '@mui/material';
import FlexBetween from "../../components/flexBetween";
import Friend from '../../components/Friend';
import WidgetWrapper from "../../components/WidgetWrapper";
import UserImage from "../../components/UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setPost } from "../../state";



const PostWidget = ({postId, postUserId, name, description, location, imageUrl, userImageUrl, likes, comments, socket}) => {
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const isLiked = Boolean(likes[loggedInUser._id]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;




  const patchLike = async () => {
    const response = await fetch(`https://socialize-0746.onrender.com/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: loggedInUser._id })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };


  const addComment = async () => {
    const response = await fetch(`https://socialize-0746.onrender.com/posts/${postId}/addComment`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        comment: {
          comment,
          userImageUrl: loggedInUser.imageUrl,
          userId: loggedInUser._id,
          name: `${loggedInUser.firstName} ${loggedInUser.lastName}`
        } 
      })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    socket.current.emit('sendNotification', {
      senderName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      receiverId: postUserId,
      type: 'commented your Post'
    });
    setComment('');
  };
  
  
  const addDefaultImg = (e) => {
    e.target.src = "https://demofree.sirv.com/nope-not-here.jpg"
    setIsLoaded(false);
  };
  

  return(
    <WidgetWrapper>
      <Friend 
        friendId={postUserId}
        name={name}
        subtitle={location}
        userImageUrl={userImageUrl}
        postId={postId}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {description}
      </Typography>
      {imageUrl !== null && (
        <img 
          width='100%'
          height='auto'
          alt='post_image'
          key={imageUrl}
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={imageUrl}
          onError={addDefaultImg}
        />
      )}
      {!isLoaded && (
        <Typography>For some reason image did not load, Try to refresh page!</Typography>
      )}
      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>

          <FlexBetween gap='0.3rem'>
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color:primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap='0.3rem'>
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>

        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box>
          <FlexBetween gap='1rem'>
            <UserImage image={loggedInUser.imageUrl} size='30px' />
            <InputBase 
              placeholder='Write your comment...'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              sx={{ width: '100%', backgroundColor: palette.neutral.light, borderRadius: '2rem', padding: '0.25rem 0.5rem'}}
            />
            <IconButton onClick={() => addComment()} ml='2rem'>
              <AddCommentOutlined />
            </IconButton>
            </FlexBetween>
          <Box mt='0.5rem'>
            <Divider /> 
            {comments.map((comment, i) => (
                <FlexBetween 
                  key={`${name}-${i}`} 
                  mt='0.5rem' 
                  mb='0.5rem' 
                  sx={{ width: '100%', backgroundColor: palette.neutral.light, borderRadius: '2rem', padding: '5px' }}
                >
                  <Box display="flex" alignItems="center" gap='1rem'>
                    <Box 
                      onClick={() => navigate(`/profile/${comment.userId}`)} 
                      sx={{ '&:hover': { color: palette.primary.light, cursor: 'pointer'} }}
                    >
                      <UserImage image={comment.userImageUrl} size='30px'/>
                    </Box>
                    <Typography>{comment.name}: </Typography>
                    <Typography sx={{ color: main }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                </FlexBetween>
          ))}
          <Divider />
        </Box>
      </Box>
      )}
    </WidgetWrapper>
  );
};


export default PostWidget;

