import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Link, SvgIcon, Typography } from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import LocalDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong");
  const [apiStatus, setApiStatus] = useState(null);

  // Add an effect to check API status on component mount
  useEffect(() => {
    async function checkApiStatus() {
      try {
        console.log('Testing OpenWeatherMap API connection...');
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=${encodeURIComponent('f313d2d7332504b2a52d6243a09027f1')}`
        );
        const data = await response.json();
        console.log('API Test Response:', data);
        
        if (data.cod === 200) {
          setApiStatus('OpenWeatherMap API is working');
        } else {
          setApiStatus(`OpenWeatherMap API error: ${data.message || 'Unknown error'}`);
          setError(true);
          setErrorMessage(`API Error: ${data.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('API check error:', err);
        setApiStatus(`API connection error: ${err.message}`);
        setError(true);
        setErrorMessage(`API Connection Error: ${err.message}`);
      }
    }
    
    checkApiStatus();
  }, []);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);
    setError(false); // Reset error state before new search

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      console.log(`Searching weather for: ${enteredData.label}, coordinates: ${latitude}, ${longitude}`);
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      
      // Check for API errors in responses
      if (todayWeatherResponse.cod !== 200) {
        throw new Error(`Weather API error: ${todayWeatherResponse.message || 'Unknown error'}`);
      }
      
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      console.error("Error in search handler:", error);
      setError(true);
      setErrorMessage(error.message || "Something went wrong");
    }

    setIsLoading(false);
  };

  // Add API status display if there's an issue
  let apiStatusDisplay = null;
  if (apiStatus && apiStatus.includes('error')) {
    apiStatusDisplay = (
      <ErrorBox
        margin="1rem auto"
        flex="inherit"
        type="info"
        errorMessage={apiStatus}
      />
    );
  }

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      {apiStatusDisplay}
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: '100px', sm: '120px', md: '140px' } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'rgba(255,255,255, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Explore current weather data and 6-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage={errorMessage}
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '0 auto',
        padding: '1rem 0 3rem',
        marginBottom: '1rem',
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: '16px', sm: '22px', md: '26px' },
                width: 'auto',
              }}
              alt="logo"
              src={Logo}
            />

            <LocalDatetime />
            <Link
              href="https://github.com/Hemanthpolavarapu"
              target="_blank"
              underline="none"
              sx={{ display: 'flex' }}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: '20px', sm: '22px', md: '26px' },
                  color: 'white',
                  '&:hover': { color: '#2d95bd' },
                }}
              />
            </Link>
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
