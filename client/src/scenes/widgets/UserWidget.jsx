import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined
} from '@mui/icons-material';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/flexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import ProfileSettings from './ProfileSettings';



const UserWidget = ({ userId, imageUrl }) => {
  const [user, setUser] = useState(null);
  const [isUserSettings, setIsUserSettings] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async() => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`}
      }
    );
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    friends
  } = user;


  return(
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap='0.5rem'
        pb='1.1rem'
      >
        <FlexBetween gap='1rem'>
          <Box 
            display='flex'
            alignItems='center'
            onClick={() => navigate(`/profile/${userId}`)} 
            sx={{ '&:hover': { color: palette.primary.light, cursor: 'pointer'} }}
          >
            <UserImage image={imageUrl} />
              <Typography
                variant='h4'
                color={dark}
                fontWeight='500'
                ml='1rem'
              >
                {firstName} {lastName}
              </Typography>
            </Box>
        </FlexBetween>
          <ManageAccountsOutlined 
            onClick={() => setIsUserSettings(!isUserSettings)} 
            sx={{ '&:hover': { cursor: 'pointer'} }}
          />
        </FlexBetween>
        <Divider />

        {/* SECOND ROW */}
        <Box p='1rem 0'>
          <Typography color={medium} md='0.5rem' mb='0.5rem' fontSize='medium' sx={{ color: main}}>Friends: {friends.length}</Typography>
          <Box display='flex' alignItems='center' gap='1rem' md='0.5rem' mb='0.5rem'>
            <LocationOnOutlined fontSize='large' sx={{ color: main}} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='1rem'>
            <WorkOutlineOutlined fontSize='large' sx={{ color: main}} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>
        {isUserSettings && (
          <Box>
          <Divider />
            <ProfileSettings />
          </Box>
        )}
    </WidgetWrapper>
  )
};


export default UserWidget;