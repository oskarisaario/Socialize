import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FlexBetween from "../../components/flexBetween.jsx";
import UserImage from '../../components/UserImage.jsx';



const Chat = ({ chat, currentUser }) => {
  const [friend, setFriend] = useState(null);



  useEffect(() => {
    const chatFriendId = chat.members.find((m) => m !== currentUser._id);
    const chatFriend = currentUser.friends.find((f) => f._id === chatFriendId);
    setFriend(chatFriend);
  }, [chat]) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        {friend && 
        <>
          <UserImage image={friend.imageUrl} size='55px' />
          <Typography>{`${friend.firstName} ${friend.lastName}`}</Typography>
        </>
        }
      </FlexBetween>
    </FlexBetween>
  )
};


export default Chat;