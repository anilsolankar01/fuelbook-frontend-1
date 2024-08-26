import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-title">
                <i style={{color: 'green'}} className="fas fa-gas-pump"></i> <strong>FuelBook</strong>
            </div>
            <div className="navbar-right">
                <div className="profile-menu" onClick={toggleDropdown}>
                    <i className="fas fa-user"></i> Profile
                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                        <Link to="/profile" className="dropdown-item">My Profile</Link>
                        <Link to="/logout" className="dropdown-item">Logout</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
