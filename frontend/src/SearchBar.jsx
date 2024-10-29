import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    
    // API for search bar need data for all the users
    if (searchTerm.length > 2) {
      try {
        const response = await axios.get(`https://your-backend-endpoint/search?query=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setSearchResults(response.data); // Expecting the response to include user details and friendship status
      } catch (err) {
        console.error('Error fetching search results:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await axios.post(`https://your-backend-endpoint/send-friend-request`, { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      alert('Friend request sent!');
    } catch (err) {
      console.error('Error sending friend request:', err);
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
      <ul className="search-results">
        {query && <SearchResults setSearchResults={setSearchResults} handleSendFriendRequest={handleSendFriendRequest} />}
      </ul>
    </div>
  );
}

const SearchResults = ({ setSearchResults, handleSendFriendRequest }) => {
  return (
    <div>
      {setSearchResults.map(user => (
        <li key={user.id}>
          {user.name} 
          {user.isFriend ? (
            <span> (Friend)</span>
          ) : (
            <button onClick={() => handleSendFriendRequest(user.id)}>Send Friend Request</button>
          )}
        </li>
      ))}
    </div>
  );
};

export default SearchBar;
