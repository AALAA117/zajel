import React, { useState, useContext } from "react";
import AuthContext from "./context/AuthContext";
import axios from "axios";

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState("");
  const { authTokens } = useContext(AuthContext);

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);

    // API for search bar need data for all the users
    if (searchTerm.length > 2) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chat/api/groups/?query=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        setSearchResults(response.data); // Expecting the response to include user details and friendship status
      } catch (err) {
        console.error("Error fetching search results:", err);
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
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;
