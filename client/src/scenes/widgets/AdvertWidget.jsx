import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/flexBetween";
import WidgetWrapper from "components/WidgetWrapper";



const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;


  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant='h5' fontWeight='500'>
          Sponsored
        </Typography>
        <Typography color={medium}>Create Add</Typography>
      </FlexBetween>
      <img 
        width='100%'
        height='auto'
        alt="advert"
        src="https://images.unsplash.com/photo-1704917205317-80ae41a55fee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D"
        style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
      />
      <FlexBetween>
        <Typography color={main}>Oskaris Travel Agency</Typography>
        <Typography color={medium}>Oskari.com</Typography>
      </FlexBetween>
      <Typography color={medium} m='0.5rem 0'>
        Your pathway to amazing journeys and adventures around the world!
      </Typography>
    </WidgetWrapper>
  )
};


export default AdvertWidget;