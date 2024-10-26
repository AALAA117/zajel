import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    // Api for search bar need data for all the users
    if (searchTerm.length > 2) {
      try {
        const response = await axios.get(`https=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search"
      />
    </div>
  );
}

export default SearchBar;
