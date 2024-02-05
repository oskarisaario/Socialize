import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index.js";



const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const user = useSelector((state) => state.user);


  const getFriends = async () => {
    const response = await fetch(
      `https://socialize-0746.onrender.com/users/${userId}/friends`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`}
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }))
  };


  useEffect(() => {
    getFriends();
  }, [user.imageUrl]) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight='500'
        sx={{ mb: '1.5rem' }}
      >
        Friends
      </Typography>
      <Box display='flex' flexDirection='column' gap='1.5rem'>
        {friends.map((friend, i) => (
          <Friend 
            key={`${friend._id}-${i}`}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userImageUrl={friend.imageUrl}
            isProfile
          />
        ))}
      </Box>
    </WidgetWrapper>
  )
};


export default FriendListWidget;