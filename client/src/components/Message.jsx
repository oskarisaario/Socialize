import { Box, Typography, useTheme} from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "timeago.js";



const Message = ({ message, own, chatFriendId }) => {
  const user = useSelector((state) => state.user);
  const { palette } = useTheme();
  const chatFriend = user.friends.find((friend) => friend._id === chatFriendId[0]);
  const main = palette.neutral.medium;
  const primary = palette.primary.dark;
  

  return (
    <Box display='flex' flexDirection='column'>
      {own ? (
        <Box display='flex' justifyContent='flex-end' mb='1rem'>
          <Box>
            <Typography>You</Typography>
            <Typography 
              backgroundColor={primary} 
              borderRadius='10px' 
              padding='5px'
              sx={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word', maxWidth:'200px', color: palette.background.alt}}
            >
              {message.text}
            </Typography>
            <Typography>{format(message.createdAt)}</Typography>
          </Box>
        </Box>
      ) : (
        <Box display='flex' justifyContent='flex-start' mb='1rem'>
          <Box>
          <Typography>{chatFriend.firstName}</Typography>
            <Typography 
              backgroundColor={main} 
              borderRadius='10px' 
              padding='5px'
              sx={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word', maxWidth:'200px', color: palette.background.alt}}
            >
              {message.text}
            </Typography>
            <Typography>{format(message.createdAt)}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
};


export default Message;