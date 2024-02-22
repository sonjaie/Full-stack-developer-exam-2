import React from 'react';

const SearchBar = ({ onSearchChange }) => {
  return (
    <>
        <input
            type="text"
            placeholder="Enter keywords"
            onChange={(event) => onSearchChange(event.target.value)}
            className="search-bar"
        />
    </>
  );
};

export default SearchBar;
