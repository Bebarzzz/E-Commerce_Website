import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Make, Model, or Year..."
                value={query}
                onChange={handleChange}
                className="search-input"
            />
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </div>
    );
};

export default SearchBar;
