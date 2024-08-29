import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form,Row ,Col, Table as BSTable } from 'react-bootstrap';
import './Trucks.css';
import CardComponent from './CardComponent';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';

const Trucks = () => {
    const [show, setShow] = useState(false);
    const [trucks, setTrucks] = useState([]);
    const [selectedTruckType, setSelectedTruckType] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [error, setError] = useState(null); // Error state

    const [newTruck, setNewTruck] = useState({
        registration_number: '',
        truck_type: '',
        ownership: 'myTruck',
        status: 'active',
    });

    const truckTypes = [
        { id: 'bus', label: 'Mini Truck / LCV', imgSrc: '/images/lcv.png' },
        { id: 'openTruck', label: 'Open Body', imgSrc: '/images/open_truck.png' },
        { id: 'closedTruck', label: 'Closed', imgSrc: '/images/closed_truck.png' },
        { id: 'trailer', label: 'Trailer', imgSrc: '/images/trailer.png' },
        { id: 'tanker', label: 'Tanker', imgSrc: '/images/tanker.png' },
        { id: 'tipper', label: 'Tipper', imgSrc: '/images/tipper.png' },
        { id: 'other', label: 'Other', imgSrc: '/images/other.png' },
    ];

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        try {
            const response = await axios.get('https://fuelbook-backend.onrender.com/api/trucks');
            setTrucks(response.data);
        } catch (error) {
            console.error('Error fetching trucks:', error);
            setError('Failed to fetch trucks. Please try again later.');
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditMode(false);
        setNewTruck({
            registration_number: '',
            truck_type: '',
            ownership: 'myTruck',
            status: 'active',
        });
        setSelectedTruckType(null);
    };

    const handleShow = () => setShow(true);

    const handleTruckTypeSelect = (type) => {
        setSelectedTruckType(type);
        setNewTruck({ ...newTruck, truck_type: type });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTruck({ ...newTruck, [name]: value });
    };

    const handleSubmit = async () => {
        if (editMode && selectedTruck) {
            try {
                const response = await axios.put(`https://fuelbook-backend.onrender.com/api/trucks/${selectedTruck.id}`, newTruck);
                if (response.status === 200) {
                    fetchTrucks();
                    handleClose();
                } else {
                    setError('Failed to update truck. Please try again.');
                }
            } catch (error) {
                console.error('Error updating truck:', error);
                setError('Failed to update truck. Please try again.');
            }
        } else {
            try {
                const response = await axios.post('https://fuelbook-backend.onrender.com/api/trucks', newTruck);
                if (response.status === 201) {
                    fetchTrucks();
                    handleClose();
                } else {
                    setError('Failed to add truck. Please try again.');
                }
            } catch (error) {
                console.error('Error adding truck:', error);
                setError('Failed to add truck. Please try again.');
            }
        }
    };

    const handleEdit = (truck) => {
        setEditMode(true);
        setSelectedTruck(truck);
        setNewTruck({
            registration_number: truck.registration_number,
            truck_type: truck.truck_type,
            ownership: truck.ownership,
            status: truck.status,
        });
        setSelectedTruckType(truck.truck_type);
        handleShow();
    };

    // Calculate counts
    const totalTrucks = trucks.length;
    const myTrucks = trucks.filter(truck => truck.ownership === 'myTruck').length;
    const marketTrucks = trucks.filter(truck => truck.ownership === 'marketTruck').length;
    const disactiveTrucks = trucks.filter(truck => truck.status === 'disactive').length;

    // Define columns for react-table
    const columns = useMemo(() => [
        {
            Header: 'S.No.',
            accessor: (row, index) => index + 1,
        },
        {
            Header: 'Registration Number',
            accessor: 'registration_number',
        },
        {
            Header: 'Truck Type',
            accessor: 'truck_type',
        },
        {
            Header: 'Ownership',
            accessor: 'ownership',
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`status-badge ${value === 'active' ? 'active' : 'disactive'}`}>
                    {value}
                </span>
            ),
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <Button variant="link" onClick={() => handleEdit(row.original)}>Edit</Button>
            ),
        },
    ], []);

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
            data: trucks,
            initialState: { pageSize: 5 },
        },
        useGlobalFilter, // for search
        useSortBy,       // for sorting
        usePagination    // for pagination
    );

    return (
        <div className='anil'>
            <div className="mt-2">
                <div className="row">
                    <CardComponent
                        iconClass="fa-truck"
                        title="Total Trucks"
                        count={totalTrucks}
                        percentage={totalTrucks > 100 ? "+55%" : "+5%"} // Example percentage change
                        description="than last week"
                    />
                    <CardComponent
                        iconClass="fa-truck"
                        title="My Trucks"
                        count={myTrucks}
                        percentage={myTrucks > 200 ? "+3%" : "+1%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))' }}
                    />
                    <CardComponent
                        iconClass="fa-truck"
                        title="Market Trucks"
                        count={marketTrucks}
                        percentage={marketTrucks > 50 ? "+3%" : "+2%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))' }}
                    />
                    <CardComponent
                        iconClass="fa-truck"
                        title="My Disactive Trucks"
                        count={disactiveTrucks}
                        percentage={disactiveTrucks > 15 ? "+3%" : "+1%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(236, 64, 122), rgb(216, 27, 96))' }}
                    />
                </div>
            </div>

            <div className="trucks-table-container mt-5">
                            <h3 className="trucks-table-title">Trucks Table</h3>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <Form.Control
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search trucks"
                    className="search-input mb-2 mb-md-0" // Margin bottom for spacing on smaller screens
                />
                <Button onClick={handleShow} className="mt-2 mt-md-0 ml-md-3">
                    + Add Truck
                </Button>
            </div>
                <BSTable hover responsive {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
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
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} key={cell.column.id}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </BSTable>

                <div className="pagination d-flex flex-column flex-sm-row align-items-center justify-content-between mb-3">
                    <div className="d-flex gap-2 mb-2 mb-sm-0">
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-secondary">
                            Previous
                        </Button>
                        <Button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-secondary">
                            Next
                        </Button>
                    </div>
                    <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-left">
                        <span className="d-block d-sm-inline-block mb-2 mb-sm-0">
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
                                className="form-control form-control-sm d-inline-block w-auto"
                                style={{ maxWidth: '100px' }}
                            />
                        </span>
                    </div>
                </div>


            </div>
            <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
    <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Truck' : 'Add Truck'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}
        <Form>
            <Row className="mb-3">
                <Col xs={12}>
                    <Form.Group controlId="formTruckRegNumber">
                        <Form.Label>Truck Registration Number *</Form.Label>
                        <Form.Control
                            type="text"
                            name="registration_number"
                            placeholder="Enter truck registration number"
                            value={newTruck.registration_number}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12}>
                    <Form.Group controlId="formTruckType">
                        <Form.Label>Truck Type</Form.Label>
                        <div className="d-flex flex-wrap">
                            {truckTypes.map((truck) => (
                                <div
                                    key={truck.id}
                                    onClick={() => handleTruckTypeSelect(truck.id)}
                                    className={`truck-type-option ${selectedTruckType === truck.id ? 'selected' : ''}`}
                                >
                                    <img src={truck.imgSrc} alt={truck.label} className="img-fluid" />
                                    <div>{truck.label}</div>
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Group controlId="formOwnership">
                        <Form.Label>Ownership</Form.Label>
                        <div className="ownership-options">
                            <Form.Check
                                type="radio"
                                label="Market Truck"
                                name="ownership"
                                id="marketTruck"
                                className="ownership-radio"
                                value="marketTruck"
                                checked={newTruck.ownership === 'marketTruck'}
                                onChange={handleInputChange}
                            />
                            <Form.Check
                                type="radio"
                                label="My Truck"
                                name="ownership"
                                id="myTruck"
                                className="ownership-radio"
                                value="myTruck"
                                checked={newTruck.ownership === 'myTruck'}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={newTruck.status}
                            onChange={handleInputChange}
                        >
                            <option value="active">Active</option>
                            <option value="disactive">Disactive</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
            {editMode ? 'Save Changes' : 'Confirm'}
        </Button>
    </Modal.Footer>
</Modal>


        </div>
    );
};

export default Trucks;
