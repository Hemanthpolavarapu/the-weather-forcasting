import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';
import { Box, Typography, Alert } from '@mui/material';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadOptions = async (inputValue) => {
    try {
      setIsLoading(true);
      
      if (!inputValue || inputValue.trim().length < 2) {
        return { options: [] };
      }

      console.log(`Searching for cities with input: "${inputValue}"`);
      const citiesList = await fetchCities(inputValue);
      
      // Check if we're using fallback based on the common fallback cities
      const possibleFallback = citiesList?.data?.some(city => 
        ['London', 'New York', 'Tokyo', 'Paris'].includes(city.name)
      );
      
      if (possibleFallback && citiesList.data.length <= 25) {
        setUsingFallback(true);
      }

      if (!citiesList || !citiesList.data || !Array.isArray(citiesList.data)) {
        console.error('Invalid response from cities API:', citiesList);
        setSearchError(true);
        return { options: [] };
      }

      setSearchError(false);
      const options = citiesList.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        };
      });
      
      console.log(`Found ${options.length} cities matching "${inputValue}"`);
      return { options };
    } catch (error) {
      console.error('Error loading cities:', error);
      setSearchError(true);
      return { options: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    if (enteredData) {
      console.log('Selected city:', enteredData);
      onSearchChange(enteredData);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {usingFallback && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            fontSize: '0.8rem',
            '& .MuiAlert-message': { padding: '0px 4px' }
          }}
        >
          Using limited cities list. Try searching for major cities (London, Tokyo, etc.)
        </Alert>
      )}
      <AsyncPaginate
        placeholder="Search for cities (type at least 2 characters)"
        debounceTimeout={600}
        value={searchValue}
        onChange={onChangeHandler}
        loadOptions={loadOptions}
        isLoading={isLoading}
      />
      {searchError && (
        <Typography
          sx={{
            color: '#DC2941',
            fontSize: '14px',
            mt: 1,
            textAlign: 'center',
          }}
        >
          Error fetching cities. Please try searching for a different city.
        </Typography>
      )}
    </Box>
  );
};

export default Search;
