import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="content">
                    <Link to="/trucks" className="sidebar-link" onClick={closeSidebar}>
                        <i className="fas fa-truck"></i> Trucks
                    </Link>
                    <Link to="/drivers" className="sidebar-link" onClick={closeSidebar}>
                        <i className="fas fa-id-card"></i> Drivers
                    </Link>
                    <Link to="/fuel-invoice" className="sidebar-link" onClick={closeSidebar}>
                        <i className="fas fa-gas-pump"></i> Fuel Invoice
                    </Link>
                    <Link to="/fuel-report" className="sidebar-link" onClick={closeSidebar}>
                        <i className="fas fa-file-alt"></i> Fuel Report
                    </Link>
                </div>
                <div className="helpline">
                    <i className="fas fa-phone"></i> Helpline <br /> 774 500 6060
                </div>
                <div className="footer">
                    <p><i style={{ color: 'green' }} className="fas fa-gas-pump"></i><strong> FuelBook</strong></p>
                    <p>100% Safe & Secure</p>
                </div>
            </div>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
