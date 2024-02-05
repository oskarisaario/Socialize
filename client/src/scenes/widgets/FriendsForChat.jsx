import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import UserImage from '../../components/UserImage.jsx';



const FriendsForChat = ({ userId, onlineUsers, setCurrentChat, chats }) => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token)
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { palette } = useTheme();


  useEffect(() => {
    setFriends(user.friends)
  }, [userId, user.friends]) // eslint-disable-line react-hooks/exhaustive-deps
  

  useEffect(() => {
    setOnlineFriends(onlineUsers.filter((os) => friends.map((f) => f._id === os._id)))
  }, [friends, onlineUsers])



  const handleClick = async (userId, ofriendId) => {
    const chatFound = chats.find((chat) => {
      return chat.members.some((id) => {
        return id === ofriendId;
      })})
    if (chatFound) {
      handleGetChat(userId, ofriendId);
    } else {
      handleNewChat(userId, ofriendId);
    }
  };


  const handleGetChat = async (userId, ofriend) => {
    try {
      const response = await fetch(`https://socialize-0746.onrender.com/chats/find/${userId}/${ofriend}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCurrentChat(data);
    } catch (err) {
      console.log(err.message)
    }
  };


  const handleNewChat = async (senderId, receiverId) => {
    try {
      const response = await fetch(`https://socialize-0746.onrender.com/chats/createChat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId
      })
    });
    const data = await response.json();
    setCurrentChat(data)
    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight='500'
        sx={{ mb: '0.5rem' }}
      >
        Friends Online
      </Typography>
      <Box display='flex' flexDirection='column' gap='1rem' mb='0.5rem'>
        {onlineFriends.map((o, i) => (
          <Box key={i}>
            <Box   
              display="flex"
              alignItems="center"
              gap='1rem'
            >
              <UserImage image={o.imageUrl} size='40px' />
              <Typography 
                onClick={() => handleClick(userId, o._id)}
                sx={{
                  '&:hover': {
                    color: palette.primary.light,
                    cursor: 'pointer'
                  }
                }}
              >{`${o.firstName} ${o.lastName}`}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </WidgetWrapper>
  )

};


export default FriendsForChat;