import { useState } from "react";
import { 
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  Popover,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Button
 } from "@mui/material";
 import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
 } from '@mui/icons-material';
 import { useDispatch, useSelector } from "react-redux";
 import { setMode, setLogout, deleteNotifications } from 'state';
 import { useNavigate } from "react-router-dom";
 import FlexBetween from "components/flexBetween";


const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const notifications = useSelector((state) => state.notifications);

  //For notication menu Popover
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const  fullName = `${user.firstName} ${user.lastName}`;


  const openNotifications = (e) => {
    setAnchorEl(e.currentTarget);
  };


  const closeNotifications = () => {
    setAnchorEl(null);
  };


  const handleRemoveNotifications = (e) => {
    e.preventDefault();
    dispatch(deleteNotifications());
    setAnchorEl(null);
  };


  const handleNotificationClick = (notificationType) => {
    if (notificationType === 'made new Post') {
      navigate('/home');
    } else if (notificationType === 'send you a new Message') {
      navigate(`/chats/${user._id}`);
    } else {
      navigate('/home');
    };
  };

  
  return (
    <>
    <FlexBetween padding='1rem 6%' backgroundColor={alt}>
      <FlexBetween gap='1.75rem'>
        <Typography 
          fontWeight='bold' 
          fontSize='clamp(1rem, 2rem, 2.25rem)' 
          color='primary' 
          onClick={() => navigate('/home')}
          sx={{'&:hover': {color:primaryLight, cursor: 'pointer'},}}
        >
          Socialize
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween backgroundColor={neutralLight} borderRadius='9px' gap='3rem' padding='0.1rem 1.5rem'>
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>
      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap='2rem'>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ): (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <IconButton 
            onClick={() => navigate(`/chats/${user._id}`)}
            sx={{'&:hover': {color:primaryLight, cursor: 'pointer'},}}
          >
            <Message sx={{ fontSize: '25px' }} />
          </IconButton>
          {notifications.length > 0 ? (
          <>
            <Badge 
              color='primary' 
              badgeContent={notifications.length}  
              onClick={openNotifications} 
              sx={{'&:hover': {color:primaryLight, cursor: 'pointer'},}} 
            >
              <Notifications />
            </Badge>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={closeNotifications}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              {notifications.map((n, i) => (
                <Typography 
                  key={i} 
                  onClick={() => handleNotificationClick(n.type)}
                  sx={{'&:hover': {backgroundColor:neutralLight, cursor: 'pointer'}, p:2}}
                >
                  {`${n.senderName} ${n.type}`}
                </Typography>
              ))}
            <Button
                fullWidth
                type="submit"
                onClick={handleRemoveNotifications}
                sx={{ 
                  m: '0', 
                  p: '1rem', 
                  backgroundColor: palette.primary.main, 
                  color: palette.background.alt, 
                  '&:hover': {color: palette.primary.main}
                }}
              >
                Clear Notifications
              </Button>
            </Popover>
          </>
          ) : (
            <Notifications sx={{ fontSize: '25px', '&:hover': {color:primaryLight, cursor: 'pointer'} }} />
          )}
          <Help sx={{ fontSize: '25px'}} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{ 
                backgroundColor: neutralLight, 
                width: '150px', 
                borderRadius: '0.25rem', 
                p: '0.25rem 1rem', 
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem'
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight
                }
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}
      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position='fixed'
          right='0'
          bottom='0'
          height='100%'
          zIndex='10'
          maxWidth='500px'
          minWidth='300px'
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display='flex' justifyContent='flex-end' p='1rem'>
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>
          {/* MENU ITEMS */}
          <FlexBetween display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap='3rem'>
          <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: '25px' }}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => navigate(`/chats/${user._id}`)}
            sx={{'&:hover': {color:primaryLight, cursor: 'pointer'},}}
          >
            <Message sx={{ fontSize: '25px' }} />
          </IconButton>
          {notifications.length > 0 ? (
          <>
            <Badge 
              color='primary' 
              badgeContent={notifications.length}  
              onClick={openNotifications} 
              sx={{'&:hover': {color:primaryLight, cursor: 'pointer'},}} 
            >
              <Notifications />
            </Badge>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={closeNotifications}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
            >
              {notifications.map((n, i) => (
                <Typography 
                  key={i} 
                  onClick={() => handleNotificationClick(n.type)}
                  sx={{'&:hover': {backgroundColor:neutralLight, cursor: 'pointer'}, p:2}}
                >
                  {`${n.senderName} ${n.type}`}
                </Typography>
              ))}
            <Button
                fullWidth
                type="submit"
                onClick={handleRemoveNotifications}
                sx={{ 
                  m: '0', 
                  p: '1rem', 
                  backgroundColor: palette.primary.main, 
                  color: palette.background.alt, 
                  '&:hover': {color: palette.primary.main}
                }}
              >
                Clear Notifications
              </Button>
            </Popover>
          </>
          ) : (
            <Notifications sx={{ fontSize: '25px', '&:hover': {color:primaryLight, cursor: 'pointer'} }} />
          )}
          <Help sx={{ fontSize: '25px' }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{ 
                backgroundColor: neutralLight, 
                width: '150px', 
                borderRadius: '0.25rem', 
                p: '0.25rem 1rem', 
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem'
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight
                }
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  </>
  );
};

export default Navbar;