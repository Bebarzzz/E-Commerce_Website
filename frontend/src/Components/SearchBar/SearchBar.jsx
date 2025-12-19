import React, { useState, useEffect, useCallback } from 'react';
import { searchCarsAPI } from '../../services/carService';
import './SearchBar.css';

const SearchBar = ({ onSearch, useBackendSearch = false }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Debounce function to delay API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Backend search function
    const handleBackendSearch = useCallback(
        debounce(async (searchQuery) => {
            if (useBackendSearch) {
                try {
                    setLoading(true);
                    const results = await searchCarsAPI(searchQuery);
                    onSearch(results, true); // Pass results and flag indicating backend search
                } catch (error) {
                    console.error('Search error:', error);
                    onSearch([], true);
                } finally {
                    setLoading(false);
                }
            }
        }, 500),
        [useBackendSearch, onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        if (useBackendSearch) {
            handleBackendSearch(value);
        } else {
            // Client-side search - pass query string
            onSearch(value);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Make, Model, or Year..."
                value={query}
                onChange={handleChange}
                className="search-input"
                disabled={loading}
            />
            {loading ? (
                <i className="fa-solid fa-spinner fa-spin search-icon"></i>
            ) : (
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
            )}
        </div>
    );
};

export default SearchBar;
