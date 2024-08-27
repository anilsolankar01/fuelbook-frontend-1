// src/components/SidebarLayout.js
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const SidebarLayout = ({ children }) => (
    <div className="App">
        <Navbar />
        <Sidebar />
        <div className="main-content">
            
            {children}
        </div>
    </div>
);

export default SidebarLayout;
