import {
  EditOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  useTheme, 
  Button, 
  IconButton, 
} from '@mui/material';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../components/flexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLogout } from '../../state';



const ProfileSettings = () => {
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const { palette } = useTheme();
  const medium = palette.neutral.medium;


  const handelChangeProfilePicture = async () => {
    const formData = new FormData();
    formData.append('picture', image)
    formData.append('imageUrl', image.name)
    const response = await fetch(`https://socialize-0746.onrender.com/users/${_id}/changeAvatar`, {
      method: 'PATCH',
      headers: {Authorization: `Bearer ${token}` },
      body: formData
    });
    const updatedUser = await response.json();
    dispatch(setUser({user : updatedUser}));
    setImage(null);
  };


  const handelDeleteAccount = async () => {
    const response = await fetch(`https://socialize-0746.onrender.com/users/${_id}/deleteUser`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data) {
      dispatch(setLogout());
    } else {
      console.log('Something went wrong');
    }
  };
 
  
  return(
    <WidgetWrapper>
        <Typography textAlign='center'>Change Profile Picture:</Typography>
        <Box
          border={`1px solid ${medium}`}
          borderRadius='5px'
          mt='0.5rem'
          mb='0.5rem'
          p='0.25rem'
          display='flex' alignItems='center' justifyContent='center'
        >
          <Dropzone
            acceptedFiles='.jpg,.jpeg,.png'
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
              <Box
                {...getRootProps()}
                border={`2px ${palette.primary.main}`}
                p='0.5rem'
                width='100%'
                sx={{ '&:hover': { cursor: 'pointer'} }}
              >
                <input {...getInputProps()} />
                {!image ? (
                  <p>Add Image Here</p>
                ) : (
                  <FlexBetween>
                    <Typography>
                      {image.name}
                    </Typography>
                    <EditOutlined />
                  </FlexBetween>
                )}
              </Box>
              {image && (
                <IconButton
                  onClick={() => setImage(null)}
                  sx={{ width: '15%' }}
                >
                  <DeleteOutlined />
                </IconButton>
              )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
        <Box textAlign='center'>
        <Button
          disabled={!image}
          onClick={() => handelChangeProfilePicture()}
          sx={{ color: palette.background.alt, backgroundColor: palette.primary.main, borderRadius: '3rem' }}
        >
            Change
        </Button>
        </Box>
        <Box mt='0.5rem' display='flex' alignItems='center' justifyContent='center' sx={{width: '100%' }}>
          <Box textAlign='center'>
            <Typography mb='0.25rem'>Delete Account:</Typography>
          <Button
            onClick={() => handelDeleteAccount()}
            sx={{ color: palette.background.alt, backgroundColor: palette.primary.main, borderRadius: '3rem' }}
            >
              Delete
            </Button>
            </Box>
        </Box>
    </WidgetWrapper>
  );
};


export default ProfileSettings;