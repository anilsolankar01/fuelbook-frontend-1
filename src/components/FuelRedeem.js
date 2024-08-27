import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import './FuelRedeem.css';

function FuelRedeem() {
    const [tokenId, setTokenId] = useState('');
    const [tokenDetails, setTokenDetails] = useState(null);
    const [message, setMessage] = useState('');

    // Function to search for token details
    const handleSearch = async () => {
        try {
            const response = await fetch(`https://fuelbook-backend.onrender.com/api/fuels/token/${tokenId}`);
            if (response.ok) {
                const data = await response.json();
                setTokenDetails(data);
                setMessage('');
            } else {
                setMessage('Token not found.');
                setTokenDetails(null);
            }
        } catch (error) {
            setMessage('Error fetching token details.');
        }
    };

    // Function to verify and update fuel_dispensed status
    const handleVerify = async () => {
        try {
            const response = await fetch(`https://fuelbook-backend.onrender.com/api/fuels/token/${tokenId}/dispense`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setMessage('Fuel dispensed status updated successfully!');
                setTokenDetails(null);
                setTokenId('');
            } else {
                setMessage('Error updating fuel dispensed status.');
            }
        } catch (error) {
            setMessage('Error updating fuel dispensed status.');
        }
    };

    return (
        <Container className=" redeembox">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4 ">Update Fuel 1</h2>
                    <Card className="p-4 shadow-sm">
                        <Form>
                            <Form.Group controlId="tokenId">
                                <Form.Label>Enter Token ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter token ID"
                                    value={tokenId}
                                    onChange={(e) => setTokenId(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                className="mt-3 w-100"
                                onClick={handleSearch}
                            >
                                Search Token
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {tokenDetails && (
                <Row className="justify-content-center mt-5">
                    <Col md={8}>
                        <Card className="p-4 shadow-sm">
                            <h4 className="mb-4">Token Details:</h4>
                            <p><strong>Fuel Type:</strong> {tokenDetails.fuel_type}</p>
                            <p><strong>Fuel Rate:</strong> {tokenDetails.fuelRate}</p>
                            <p><strong>Fuel Liters:</strong> {tokenDetails.fuelLtr}</p>
                            <p><strong>Amount:</strong> {tokenDetails.amount}</p>
                            <p><strong>KM Reading (Current):</strong> {tokenDetails.kmReadingCurrent}</p>
                            <p><strong>KM Reading (After):</strong> {tokenDetails.kmReadingAfter}</p>
                            <p><strong>Status:</strong> {tokenDetails.status}</p>
                            <p><strong>Fuel Dispensed:</strong> {tokenDetails.fuel_dispensed ? 'Yes' : 'No'}</p>
                            <Button
                                variant="success"
                                className="mt-3 w-100"
                                onClick={handleVerify}
                            >
                                Verify and Update Fuel
                            </Button>
                        </Card>
                    </Col>
                </Row>
            )}

            {message && (
                <Row className="justify-content-center mt-3">
                    <Col md={6}>
                        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                            {message}
                        </Alert>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default FuelRedeem;


