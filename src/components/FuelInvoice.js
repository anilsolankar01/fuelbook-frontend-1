import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Row, Col, Table as BSTable } from 'react-bootstrap';
import './FuelInvoice.css';
import CardComponent from './CardComponent';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';

const FuelInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [pumps, setPumps] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [error, setError] = useState(null);
    const [viewDetails, setViewDetails] = useState(false);
    const [showAddPumpModal, setShowAddPumpModal] = useState(false);
    const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
    const [newPump, setNewPump] = useState({
        name: '',
        location: '',
        initial_amount: '',
        contact: ''
    });
    const [newInvoice, setNewInvoice] = useState({
        token_id: '',
        pump_id: '',
        fuel_type: '',
        fuelRate: '',
        fuelLtr: '',
        amount: '',
        driver_id: '',
        truck_id: '',
        kmReadingCurrent: '',
        kmReadingAfter: '',
        km_reading_photo_url: 'na',
        bill_photo_url: 'na',
        km_reading_photo_url2: 'na',
        bill_photo_url2: 'na',
        status: 'not verified',
        qr_code: 'na',
        generated_by: 1,
        fuel_attendant_id: 1
    });

    useEffect(() => {
        fetchInvoices();
        fetchPumps();
        fetchTrucks();
        fetchDrivers();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fuels');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setError('Failed to fetch invoices. Please try again later.');
        }
    };

    const fetchPumps = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pumps');
            setPumps(response.data);
        } catch (error) {
            console.error('Error fetching pumps:', error);
            setError('Failed to fetch pumps. Please try again later.');
        }
    };

    const fetchTrucks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/trucks');
            setTrucks(response.data);
        } catch (error) {
            console.error('Error fetching trucks:', error);
            setError('Failed to fetch trucks. Please try again later.');
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setError('Failed to fetch drivers. Please try again later.');
        }
    };

    const getPumpNameById = (id) => {
        const pump = pumps.find(p => p.id === id);
        return pump ? pump.name : 'Unknown Pump';
    };

    const getTruckRegistrationById = (id) => {
        const truck = trucks.find(t => t.id === id);
        return truck ? truck.registration_number : 'Unknown Truck';
    };

    const getDriverNameById = (id) => {
        const driver = drivers.find(d => d.id === id);
        return driver ? driver.name : 'Unknown Driver';
    };

    const handleRowClick = (entry) => {
        setSelectedEntry(entry);
        setViewDetails(true);
    };

    const handleBackToTable = () => {
        setViewDetails(false);
        setSelectedEntry(null);
    };

    const handleShowAddPumpModal = () => setShowAddPumpModal(true);
    const handleCloseAddPumpModal = () => setShowAddPumpModal(false);

    const handleShowAddInvoiceModal = () => setShowAddInvoiceModal(true);
    const handleCloseAddInvoiceModal = () => setShowAddInvoiceModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPump(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInvoiceInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvoice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPump = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/pumps', newPump);
            setNewPump({
                name: '',
                location: '',
                initial_amount: '',
                contact: ''
            });
            handleCloseAddPumpModal();
            fetchPumps(); // Refresh the pump list
        } catch (error) {
            console.error('Error adding pump:', error);
            setError('Failed to add pump. Please try again later.');
        }
    };

    const handleAddInvoice = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/fuels', newInvoice);
            setNewInvoice({
                token_id: '',
                pump_id: '',
                fuel_type: '',
                fuelRate: '',
                fuelLtr: '',
                amount: '',
                driver_id: '',
                truck_id: '',
                kmReadingCurrent: '',
                kmReadingAfter: '',
                km_reading_photo_url: '',
                bill_photo_url: '',
                km_reading_photo_url2: '',
                bill_photo_url2: '',
                status: 'not verified',
                qr_code: '',
                generated_by: 1,
                fuel_attendant_id: 1
            });
            handleCloseAddInvoiceModal();
            fetchInvoices(); // Refresh the invoice list
        } catch (error) {
            console.error('Error adding invoice:', error);
            setError('Failed to add invoice. Please try again later.');
        }
    };

    // Calculate counts
    const totalInvoices = invoices.length;
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'not verified').length;
    const verifiedInvoices = invoices.filter(invoice => invoice.status === 'verified').length;
    const fuelDispensed = invoices.filter(invoice => invoice.fuel_dispensed === 1).length;
    const fuelNotDispensed = invoices.filter(invoice => invoice.fuel_dispensed === 0).length;

    // Define columns for react-table
    const columns = useMemo(() => [
        {
            Header: 'S.No.',
            accessor: (row, index) => index + 1,
        },
        {
            Header: 'Token No',
            accessor: 'token_id',
        },
        {
            Header: 'Date',
            accessor: 'created_at',
        },
        {
            Header: 'Truck Registration',
            accessor: 'truck_id',
            Cell: ({ value }) => getTruckRegistrationById(value),
        },
        {
            Header: 'Driver',
            accessor: 'driver_id',
            Cell: ({ value }) => getDriverNameById(value),
        },
        {
            Header: 'Pump',
            accessor: 'pump_id',
            Cell: ({ value }) => getPumpNameById(value),
        },
        {
            Header: 'Liters',
            accessor: 'fuelLtr',
        },
        {
            Header: 'Amount',
            accessor: 'amount',
        },
        {
            Header: 'Redeem',
            accessor: 'fuel_dispensed',
            Cell: ({ value }) => (
                <span className={`status-badge ${value === 1 ? 'redeem' : 'not-redeem'}`}>
                    {value === 1 ? 'Redeemed' : 'Not Redeemed'}
                </span>
            ),
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`status-badge ${value === 'verified' ? 'verified' : 'not-verified'}`}>
                    {value}
                </span>
            ),
        },
    ], [pumps, trucks, drivers]);

    // Use react-table hooks
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        setGlobalFilter,
        state: { pageIndex, globalFilter },
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        pageOptions,
        gotoPage,
        pageCount,
    } = useTable(
        {
            columns,
            data: invoices,
            initialState: { pageSize: 5 },
        },
        useGlobalFilter, // for search
        useSortBy,       // for sorting
        usePagination    // for pagination
    );

    return (
        <div className='fuel-invoice'>
            <div className="mt-2">
                <div className="row">
                    <CardComponent
                        iconClass="fa-file-invoice"
                        title="Verified Invoices"
                        count={verifiedInvoices}
                        percentage={verifiedInvoices > 30 ? "+3.48%" : "-1.10%"}
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))' }}
                    />
                    <CardComponent
                        iconClass="fa-hourglass-half"
                        title="Pending Invoices"
                        count={pendingInvoices}
                        percentage={pendingInvoices > 10 ? "+5.23%" : "-0.75%"}
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(251, 140, 0), rgb(253, 216, 53))' }}
                    />
                    <CardComponent
                        iconClass="fa-tint"
                        title="Fuel Dispensed"
                        count={fuelDispensed}
                        percentage={fuelDispensed > 50 ? "+4.75%" : "-2.00%"}
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))' }}
                    />
                    <CardComponent
                        iconClass="fa-ban"
                        title="Fuel Not Dispensed"
                        count={fuelNotDispensed}
                        percentage={fuelNotDispensed < 20 ? "-3.10%" : "+2.85%"}
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(236, 64, 122), rgb(216, 27, 96))' }}
                    />
                </div>
            </div>

            <div className="invoices-table-container mt-5">
                <h3 className="invoice-table-title">Fuel Invoices Table</h3>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <div className="mb-2 mb-md-0 w-100 w-md-auto">
                    <Form.Control
                        type="text"
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search invoices"
                        className="search-input"
                    />
                </div>
                <div className="d-flex mt-2 mt-md-0">
                    <Button
                        variant="primary"
                        onClick={handleShowAddPumpModal}
                        className="me-2"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        +Add Pump
                    </Button>
                    <Button onClick={handleShowAddInvoiceModal} style={{ whiteSpace: 'nowrap' }}>
                        +Add Invoice
                    </Button>
                </div>
            </div>


                {viewDetails ? (
                    <div className="detail-view-container">
                        <Button onClick={handleBackToTable} className="mb-3">
                            ← Back
                        </Button>
                        {selectedEntry && (
                            <div className="detail-content">
                                <h3 className="mb-3">Token No: {selectedEntry.token_id}</h3>
                                <div className="row">
                                    <div className="col-md-4">
                                        <p><strong>Date:</strong> {selectedEntry.created_at}</p>
                                        <p><strong>Truck Registration:</strong> {selectedEntry.truck_id}</p>
                                        <p><strong>Pump:</strong> {getPumpNameById(selectedEntry.pump_id)}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Amount:</strong> ₹{selectedEntry.amount}</p>
                                        <p><strong>Liters:</strong> {selectedEntry.fuelLtr}</p>
                                        <div className="image-wrapper">
                                            <img src={selectedEntry.bill_photo_url} alt="Fuel Bill" className="img-fluid bordered-image" />
                                            <p className="image-label">Fuel Bill</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Kilometers:</strong> {selectedEntry.kmReadingCurrent} - {selectedEntry.kmReadingAfter}</p>
                                        <div className="image-wrapper">
                                            <img src={selectedEntry.km_reading_photo_url} alt="Odometer Reading" className="img-fluid bordered-image" />
                                            <p className="image-label">Odometer Reading</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="action-buttons d-flex justify-content-center mt-3">
                                    <Button className="button-verify me-2">Verify</Button>
                                    <Button className="button-unverify">Unverify</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <BSTable  hover responsive {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </BSTable>
                )}
               <div className="pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </Button>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </Button>
                </div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                    />
                </span>
            </div>

            </div>

            <Modal show={showAddPumpModal} onHide={handleCloseAddPumpModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Pump</Modal.Title>
            </Modal.Header>
                <Form onSubmit={handleAddPump}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formPumpName">
                                    <Form.Label>Pump Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter pump name"
                                        name="name"
                                        value={newPump.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPumpLocation">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter pump location"
                                        name="location"
                                        value={newPump.location}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formPumpInitialAmount">
                                    <Form.Label>Initial Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter initial amount"
                                        name="initial_amount"
                                        value={newPump.initial_amount}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPumpContact">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter contact"
                                        name="contact"
                                        value={newPump.contact}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddPumpModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add Pump
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            <Modal show={showAddInvoiceModal} onHide={handleCloseAddInvoiceModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Invoice</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddInvoice}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formTokenID">
                                    <Form.Label>Token ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter token ID"
                                        name="token_id"
                                        value={newInvoice.token_id}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPumpID">
                                    <Form.Label>Pump</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="pump_id"
                                        value={newInvoice.pump_id}
                                        onChange={handleInvoiceInputChange}
                                    >
                                        <option value="">Select Pump</option>
                                        {pumps.map(pump => (
                                            <option key={pump.id} value={pump.id}>
                                                {pump.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFuelType">
                                    <Form.Label>Fuel Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter fuel type"
                                        name="fuel_type"
                                        value={newInvoice.fuel_type}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formFuelRate">
                                    <Form.Label>Fuel Rate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter fuel rate"
                                        name="fuelRate"
                                        value={newInvoice.fuelRate}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFuelLiters">
                                    <Form.Label>Liters</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter liters"
                                        name="fuelLtr"
                                        value={newInvoice.fuelLtr}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formAmount">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount"
                                        name="amount"
                                        value={newInvoice.amount}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formDriverID">
                                    <Form.Label>Driver</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="driver_id"
                                        value={newInvoice.driver_id}
                                        onChange={handleInvoiceInputChange}
                                    >
                                        <option value="">Select Driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formTruckID">
                                    <Form.Label>Truck</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="truck_id"
                                        value={newInvoice.truck_id}
                                        onChange={handleInvoiceInputChange}
                                    >
                                        <option value="">Select Truck</option>
                                        {trucks.map(truck => (
                                            <option key={truck.id} value={truck.id}>
                                                {truck.registration_number}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formKmReadingCurrent">
                                    <Form.Label>KM Reading (Current)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter current km reading"
                                        name="kmReadingCurrent"
                                        value={newInvoice.kmReadingCurrent}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formKmReadingAfter">
                                    <Form.Label>KM Reading (After)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter km reading after"
                                        name="kmReadingAfter"
                                        value={newInvoice.kmReadingAfter}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddInvoiceModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add Invoice
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </div>
    );
};

export default FuelInvoice;
