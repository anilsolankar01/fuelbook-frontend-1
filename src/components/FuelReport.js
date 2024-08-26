import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import CardComponent from './CardComponent'; // Assuming you have a CardComponent similar to the Trucks/Drivers

const FuelReport = () => {
    const [pumps, setPumps] = useState([]);
    const [balances, setBalances] = useState([]);
    const [selectedPump, setSelectedPump] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        date: '',
        amount: '',
        method: ''
    });
    const { pumpId } = useParams();
    const navigate = useNavigate();

    // Fetch Pump Details
    useEffect(() => {
        const fetchPumps = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pumps');
                setPumps(response.data || []);
            } catch (error) {
                console.error('Error fetching pumps:', error);
            }
        };

        fetchPumps();
    }, []);

    // Fetch Pump Balances
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/pumps/bal');
                setBalances(response.data || []);
            } catch (error) {
                console.error('Error fetching pump balances:', error);
            }
        };

        fetchBalances();
    }, []);

    // Fetch Selected Pump Details
    useEffect(() => {
        if (pumpId) {
            const fetchSelectedPump = async () => {
                try {
                    const [pumpResponse, tokensResponse, paymentsResponse] = await Promise.all([
                        axios.get(`http://localhost:5000/api/pumps/${pumpId}`),
                        axios.get(`http://localhost:5000/api/fuels/by-pump/${pumpId}`),
                        axios.get(`http://localhost:5000/api/payments/pump/${pumpId}`)
                    ]);

                    setSelectedPump({
                        ...pumpResponse.data,
                        tokens: tokensResponse.data || [],
                        payments: paymentsResponse.data || []
                    });
                } catch (error) {
                    console.error('Error fetching selected pump details:', error);
                }
            };

            fetchSelectedPump();
        }
    }, [pumpId]);

    const handleShowModal = (token) => {
        setSelectedToken(token);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleShowPaymentModal = () => {
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => setShowPaymentModal(false);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/payments/pump/${pumpId}`, paymentDetails);
            setSelectedPump(prev => ({
                ...prev,
                payments: [
                    ...prev.payments,
                    {
                        paymentNo: `P00${prev.payments.length + 1}`,
                        ...paymentDetails
                    }
                ]
            }));
            handleClosePaymentModal();
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    };

    if (!pumps.length) {
        return <div>Loading...</div>;
    }

    // Total Amount to Pay Calculation
    const totalAmountToPay = pumps.reduce((total, pump) => {
        const pumpBalance = balances.find(balance => balance.pump_id === pump.id)?.balance || 0;
        return total + parseFloat(pumpBalance); // Ensure balance is a number
    }, 0);

    // Format as currency
    const formattedTotalAmountToPay = `₹${totalAmountToPay.toFixed(2)}`;

    return (
        <div className="anil">
            {!pumpId ? (
                <>
                    {/* Cards for Summary */}
                    <div className="row">
                        <CardComponent
                            iconClass="fa-gas-pump"
                            title="Total Amount to Pay"
                            count={formattedTotalAmountToPay} // Pass the formatted amount to the card
                            description="Across all pumps"
                        />
                    </div>

                    {/* Table for Pump List */}
                    <Table striped hover responsive className="mt-4">
                        <thead>
                            <tr>
                                <th>Pump Name</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pumps.map((pump, index) => {
                                const pumpBalance = balances.find(balance => balance.pump_id === pump.id)?.balance || 'N/A';
                                return (
                                    <tr key={index} onClick={() => navigate(`/fuel-report/${pump.id}`)} style={{ cursor: 'pointer' }}>
                                        <td>{pump.name}</td>
                                        <td>₹{pumpBalance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </>
            ) : (
                <>
                    <Button variant="secondary" className="mb-3" onClick={() => navigate('/fuel-report')}>
                        ← Back
                    </Button>
                    <h3>{selectedPump?.name || 'Loading...'}</h3>
                    <Button variant="info" style={{ float: 'right' }} className="mb-3" onClick={handleShowPaymentModal}>
                        Add Payment
                    </Button>

                    <div className="row mt-4">
                        <CardComponent
                            iconClass="fa-wallet"
                            title="TO PAY"
                            count={`₹${selectedPump?.balance || 0}`} // Show selected pump's balance
                            description="Amount pending"
                        />
                    </div>

                    <h3 className="mt-5">Token History</h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Token No.</th>
                                <th>Date</th>
                                <th>Truck Registration</th>
                                <th>Amount</th>
                                <th>Liters</th>
                                <th>Km Reading</th>
                                <th>Redeem</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPump?.tokens?.map((token, index) => (
                                <tr key={index} onClick={() => handleShowModal(token)} style={{ cursor: 'pointer' }}>
                                    <td>{index + 1}</td>
                                    <td>{token.token_id}</td>
                                    <td>{token.date}</td>
                                    <td>{token.truck_id}</td>
                                    <td>₹{token.amount}</td>
                                    <td>{token.fuelLtr}</td>
                                    <td>{token.kmReadingCurrent} - {token.kmReadingAfter}</td>
                                    <td>{token.redeem ? "Yes" : "No"}</td>
                                    <td>{token.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h3 className="mt-5">Payment History</h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPump?.payments?.map((payment, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{payment.payment_date}</td>
                                    <td>₹{payment.amount}</td>
                                    <td>{payment.method}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal for Token Details */}
                    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Token Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedToken && (
                                <div className="row">
                                    <div className="col-md-4">
                                        <h5>Details</h5>
                                        <p><strong>Date:</strong> {selectedToken.date}</p>
                                        <p><strong>Truck Registration:</strong> {selectedToken.truck_id}</p>
                                        <p><strong>Amount:</strong> ₹{selectedToken.amount}</p>
                                        <p><strong>Liters:</strong> {selectedToken.fuelLtr}</p>
                                        <p><strong>Km Reading:</strong> {selectedToken.kmReadingCurrent} - {selectedToken.kmReadingAfter}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Fuel Image</h5>
                                        <img src={selectedToken.bill_photo_url} alt="Fuel Bill" className="img-fluid" style={{ width: '200px', height: '200px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Odometer Image</h5>
                                        <img src={selectedToken.km_reading_photo_url} alt="Odometer Reading" className="img-fluid" style={{ width: '200px', height: '200px', border: '1px solid #ccc' }} />
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal for Adding Payment */}
                    <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Payment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handlePaymentSubmit}>
                                <Form.Group controlId="paymentDate">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={paymentDetails.date}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, date: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="paymentAmount">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentDetails.amount}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="paymentMethod">
                                    <Form.Label>Payment Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentDetails.method}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, method: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">Submit Payment</Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClosePaymentModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default FuelReport;
