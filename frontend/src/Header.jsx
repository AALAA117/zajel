import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import LOGOUT from './assets/logout.webp';
import Default from './assets/default.jpeg';

function Header({ onlogout }) {
    const history = useHistory();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // get the user data for personal page
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        onlogout();
        history.push('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <header className="upperpart">
            <h1 className="title">zajel</h1>
            <div className="personal-container">
                <button className="personal" onClick={toggleDropdown}>
                    <img
                        src={userData?.image || Default}
                        alt="personal_page"
                        width="35" 
                        height="35" 
                    />
                </button>
                {isDropdownOpen && (
                    <div className="dropdown" ref={dropdownRef}>
                        {userData && (
                            <div className="user-info">
                                <img
                                    src={userData.image || Default}
                                    alt="User"
                                    className="user-image"
                                />
                                <div className="user-details">
                                    <p className="user-name">name: {userData.name}</p>
                                    <p className="user-email">email: {userData.email}</p>
                                    <p className="user-info">info: {userData.info}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button className="logout" onClick={handleLogout}>
                <img
                    src={LOGOUT}
                    alt="Logout"
                    width="35" 
                    height="35" 
                />
            </button>
        </header>
    );
}

export default Header;
