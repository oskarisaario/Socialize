import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar/index.jsx";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import { io } from 'socket.io-client';



const ProfilePage = ({ socket }) => {
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const [user, setUser] = useState();
  const { userId } = useParams();


  const getUser = async () => {
    const response = await fetch(`https://socialize-0746.onrender.com/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    setUser(data);
  };


  useEffect(() => {
    if (!socket.current) {
      socket.current = io("https://socialize-0746.onrender.com", {transports: ['websocket']});
      //socket.current = io("ws://localhost:3002");
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  

  useEffect(() => {
    getUser();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  
  return(
    <Box>
      <Navbar />
        {user && (
        <Box
          width='100%'
          padding='2rem 6%'
          display={isNonMobileScreen ? 'flex' : 'block'}
          gap='2rem'
          justifyContent='center'
        >
          <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
            <UserWidget userId={userId} imageUrl={user.imageUrl}/>
            <Box m='2rem 0' />
            <FriendListWidget userId={userId} isProfile/>
          </Box>
          <Box 
            flexBasis={isNonMobileScreen ? '42%' : undefined}
            mt={isNonMobileScreen ? undefined : '2rem'}
          >
            {userId === loggedUser._id && (
              <>
              <MyPostWidget imageUrl={loggedUser.imageUrl} />
              <Box m='2rem 0' />
              </>
            )}
            <PostsWidget userId={userId} isProfile />
          </Box>         
        </Box>
        )}
    </Box>
  )
};


export default ProfilePage;