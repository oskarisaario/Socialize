import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";



const HomePage = ({ socket, notifications }) => {
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px');
  const { _id, imageUrl } = useSelector((state) => state.user);


  return(
  <Box>
    <Navbar notifications={notifications}/>
    <Box
      width='100%'
      padding='2rem 6%'
      display={isNonMobileScreen ? 'flex' : 'block'}
      gap='0.5rem'
      justifyContent='space-between'
    >
      <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
        <UserWidget userId={_id} imageUrl={imageUrl}/>
      </Box>
      <Box 
        flexBasis={isNonMobileScreen ? '42%' : undefined}
        mt={isNonMobileScreen ? undefined : '2rem'}
      >
        <MyPostWidget imageUrl={imageUrl} socket={socket}/>
        <Box m='2rem 0' />
        <PostsWidget userId={_id} socket={socket}/>
      </Box>
      {isNonMobileScreen && (
        <Box flexBasis='26%'>
          <AdvertWidget />
          <Box m='2rem 0' />
          <FriendListWidget userId={_id} />
        </Box>
      )}
    </Box>
  </Box>
  );
};


export default HomePage;