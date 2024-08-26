import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Trucks from './components/Trucks';
import Drivers from './components/Drivers';
import FuelInvoice from './components/FuelInvoice';
import './App.css';
import FuelReport from './components/FuelReport';

function App() {
    return (
        <Router>
            <div className="App">
                <Sidebar />
                    <Navbar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/trucks" element={<Trucks />} />
                            <Route path="/drivers" element={<Drivers />} />
                            <Route path="/fuel-invoice" element={<FuelInvoice />} />
                            <Route path="/fuel-report" element={<FuelReport />} />
                            <Route path="/fuel-report/:pumpId" element={<FuelReport />} />
                            <Route path="/" element={<Trucks />} />
                        </Routes>
                    </div>
                </div>
        </Router>
    );
}

export default App;
