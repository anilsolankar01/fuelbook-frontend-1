import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Trucks from './components/Trucks';
import Drivers from './components/Drivers';
import FuelInvoice from './components/FuelInvoice';
import FuelReport from './components/FuelReport';
import FuelRedeem from './components/FuelRedeem';
import SidebarLayout from './components/SidebarLayout';
import Navbar from './components/Navbar';
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                {/* Layout with Sidebar */}
                <Route path="/trucks" element={<SidebarLayout><Trucks /></SidebarLayout>} />
                <Route path="/drivers" element={<SidebarLayout><Drivers /></SidebarLayout>} />
                <Route path="/fuel-invoice" element={<SidebarLayout><FuelInvoice /></SidebarLayout>} />
                <Route path="/fuel-report" element={<SidebarLayout><FuelReport /></SidebarLayout>} />
                <Route path="/fuel-report/:pumpId" element={<SidebarLayout><FuelReport /></SidebarLayout>} />

                {/* Layout with Only Navbar */}
                <Route path="/fuel-redeem" element={
                    <div>
                        <Navbar />
                        <div className="container mt-5">
                            <FuelRedeem />
                        </div>
                    </div>
                } />

                {/* Default Route */}
                <Route path="/" element={<SidebarLayout><Trucks /></SidebarLayout>} />
            </Routes>
        </Router>
    );
}

export default App;
