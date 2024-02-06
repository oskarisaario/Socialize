import { Box, useMediaQuery, Typography, useTheme, InputBase, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/index.jsx";
import FriendsForChat from "../widgets/FriendsForChat.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import Message from '../../components/Message.jsx';
import Chat from '../widgets/Chat.jsx';
import FlexBetween from '../../components/flexBetween.jsx';
import { io } from 'socket.io-client';



const ChatPage = ({ socket }) => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { userId } = useParams();
  const scrollRef = useRef();
  const { palette } = useTheme();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);


  const getChats = async () => {
    try {
      const response = await fetch(`https://socialize-0746.onrender.com/chats/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setChats(data);
    } catch (err) {
      console.log(err);
    } 
  };


  const getMessages = async () => {
    try {
      const response = await fetch(`https://socialize-0746.onrender.com/messages/getMessages/${currentChat._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    } 
  };


  useEffect(() => {
    if (!socket.current) {
      socket.current = io("https://socialize-0746.onrender.com", {transports: ['websocket']});
      //socket.current = io("ws://localhost:3002");
    }
    socket.current.on('getMessage', data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', users => {
      setOnlineUsers(user.friends.filter((f) => users.some((u) => u.userId === f._id)));
    });
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    getChats();
  }, [user._id, currentChat, arrivalMessage]) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps


  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      chatId: currentChat._id
    };
    const receiverId = currentChat.members.find(member => member !== user._id)
    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage
    });
    try {
      const response = await fetch(`https://socialize-0746.onrender.com/messages/createMessage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      socket.current.emit('sendNotification', {
        senderName: `${user.firstName} ${user.lastName}`,
        receiverId,
        type: 'send you a new Message'
      });
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };


  return(
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreen ? 'flex' : 'block'}
        gap='0.5rem'
        justifyContent='space-between'
      >
        <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
          <WidgetWrapper>
            <Typography 
              color={palette.neutral.dark}
              variant="h5"
              fontWeight='500'
              sx={{ mb: '0.5rem' }}
            >
              Chats
            </Typography>
            <Box display='flex' flexDirection='column' gap='1.5rem'>
              {chats.map((c, i) => (
                  <Box
                    key={`${i}`}
                    onClick = {() => setCurrentChat(c)}
                    sx={{
                      '&:hover': {
                        color: palette.primary.light,
                        cursor: 'pointer'
                      }
                    }}                
                  >
                    <Chat
                      chat={c}
                      currentUser={user}
                    />
                  </Box>
              ))}
            </Box>
          </WidgetWrapper>
        </Box>
        <Box 
          flexBasis={isNonMobileScreen ? '42%' : undefined}
          mt={isNonMobileScreen ? undefined : '2rem'}
        >
          <WidgetWrapper>
            {currentChat ? (
            <>
              {messages[0] && messages[1] !== null ? (
              <Box>
                {messages.map((m, i) => (
                  <div ref={scrollRef} key={i}>
                    <Message  message={m} own={m.sender === user._id} chatFriendId={ currentChat.members.filter(m => m !== user._id)}/>
                  </div>
                ))}
              </Box>
              ) : (
                <Typography variant="h3" fontWeight='500' textAlign='center' mb='1rem'>No messages yet!</Typography>
              )}
              <FlexBetween>
                <InputBase 
                  placeholder='Write your message here...'
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  sx={{ width: '100%', backgroundColor: palette.neutral.light, borderRadius: '2rem', padding: '0.5rem 1rem'}}
                />
                <Button
                  onClick={handleSubmit}
                  sx={{ color: palette.background.alt, backgroundColor: palette.primary.main, borderRadius: '2rem', ml: '1rem', padding: '0.5rem 1rem'}}
                >
                  SEND
                </Button>
              </FlexBetween>
            </>
            ) : (
              <Typography 
              color={palette.neutral.dark}
              textAlign='center'
              variant="h3"
              fontWeight='500'
              sx={{ mb: '1.5rem' }}
            >
              Click your friend on the right to start chat!
            </Typography>
            )}
          </WidgetWrapper>
        </Box>
        <Box flexBasis={isNonMobileScreen ? '26%' : undefined} 
          mt={isNonMobileScreen ? undefined : '2rem'}
        >
          <FriendsForChat userId={user._id} onlineUsers={onlineUsers} setCurrentChat={setCurrentChat} chats={chats} />
        </Box>
      </Box>
    </Box>
  )
};


export default ChatPage;