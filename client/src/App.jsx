import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homepage/index.jsx";
import LoginPage from "./scenes/loginpage/index.jsx";
import ProfilePage from "./scenes/profilepage/index.jsx";
import ChatPage from "./scenes/chatpage/index.jsx";
import { useMemo, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "./state/index.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { io } from 'socket.io-client';

function App() {
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!socket.current && isAuth) {
      socket.current = io("https://socialize-0746.onrender.com", {transports: ['websocket']});
      socket.current.emit('addUser', user._id);
    }
    if (isAuth) {
      socket.current.on('getUsers', users => {
        setOnlineUsers(user.friends.filter((f) => users.some((u) => u.userId === f._id)));
      });
      socket.current.on('getNotification', data => {
        const notification = {};
        notification.senderName = data.senderName;
        notification.type = data.type;
        dispatch(setNotifications( notification ));
      });
      return () => socket.current.off("getNotification");
    }
  }, [isAuth]) // eslint-disable-line react-hooks/exhaustive-deps


 
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/home' element={isAuth ? <HomePage socket={socket} /> : <Navigate to='/' />} />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage socket={socket} /> : <Navigate to='/' />} />
            <Route path='/chats/:userId' element={isAuth ? <ChatPage socket={socket} /> : <Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};


export default App;
