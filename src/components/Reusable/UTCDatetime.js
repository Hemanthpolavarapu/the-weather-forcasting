import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getLocalDatetime } from '../../utilities/DatetimeUtils';

const LocalDatetime = () => {
  const [localTime, setLocalTime] = useState(getLocalDatetime());
  
  useEffect(() => {
    // Update time immediately once
    setLocalTime(getLocalDatetime());
    
    // Update the time every 10 seconds for better accuracy
    const interval = setInterval(() => {
      setLocalTime(getLocalDatetime());
    }, 10000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontWeight: '400',
        fontSize: { xs: '10px', sm: '12px' },
        color: 'rgba(255, 255, 255, .7)',
        lineHeight: 1,
        paddingRight: '2px',
        fontFamily: 'Poppins',
      }}
    >
      {localTime}
    </Typography>
  );
};

export default LocalDatetime;
