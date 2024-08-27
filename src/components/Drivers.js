import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Table as BSTable } from 'react-bootstrap';
import './Drivers.css';
import CardComponent from './CardComponent';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';

const Drivers = () => {
    const [show, setShow] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [error, setError] = useState(null);
    const [newDriver, setNewDriver] = useState({
        name: '',
        contact: '',
        address: '',
        driving_license: '',
        ownership: 'myDriver',
        status: 'active',
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('https://fuelbook-backend.onrender.com/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setError('Failed to fetch drivers. Please try again later.');
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditMode(false);
        setNewDriver({
            name: '',
            contact: '',
            address: '',
            driving_license: '',
            ownership: 'myDriver',
            status: 'active',
        });
        setSelectedDriver(null);
    };

    const handleShow = () => setShow(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDriver({ ...newDriver, [name]: value });
    };

    const handleSubmit = async () => {
        if (editMode && selectedDriver) {
            try {
                const response = await axios.put(`https://fuelbook-backend.onrender.com/api/drivers/${selectedDriver.id}`, newDriver);
                if (response.status === 200) {
                    fetchDrivers();
                    handleClose();
                } else {
                    setError('Failed to update driver. Please try again.');
                }
            } catch (error) {
                console.error('Error updating driver:', error);
                setError('Failed to update driver. Please try again.');
            }
        } else {
            try {
                console.log("data send from form "+ newDriver)
                const response = await axios.post('https://fuelbook-backend.onrender.com/api/drivers', newDriver);
                console.log("response "+ response)
                if (response.status === 201) {
                    fetchDrivers();
                    handleClose();
                } else {
                    setError('Failed to add driver. Please try again.');
                }
            } catch (error) {
                console.error('Error adding driver:', error);
                setError('Failed to add driver. Please try again.');
            }
        }
    };

    const handleEdit = (driver) => {
        setEditMode(true);
        setSelectedDriver(driver);
        setNewDriver({
            name: driver.name,
            contact: driver.contact,
            address: driver.address,
            driving_license: driver.driving_license,
            ownership: driver.ownership,
            status: driver.status,
        });
        handleShow();
    };

    // Calculate counts
    const totalDrivers = drivers.length;
    const myDrivers = drivers.filter(driver => driver.ownership === 'myDriver').length;
    const marketDrivers = drivers.filter(driver => driver.ownership === 'marketDriver').length;
    const disactiveDrivers = drivers.filter(driver => driver.status === 'disactive').length;

    // Define columns for react-table
    const columns = useMemo(() => [
        {
            Header: 'S.No.',
            accessor: (row, index) => index + 1,
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Contact',
            accessor: 'contact',
        },
        {
            Header: 'Driving License',
            accessor: 'driving_license',
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
            data: drivers,
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
                        iconClass="fa-user"
                        title="Total Drivers"
                        count={totalDrivers}
                        percentage={totalDrivers > 100 ? "+55%" : "+5%"} // Example percentage change
                        description="than last week"
                    />
                    <CardComponent
                        iconClass="fa-user"
                        title="My Drivers"
                        count={myDrivers}
                        percentage={myDrivers > 200 ? "+3%" : "+1%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))' }}
                    />
                    <CardComponent
                        iconClass="fa-user"
                        title="Market Drivers"
                        count={marketDrivers}
                        percentage={marketDrivers > 50 ? "+3%" : "+2%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))' }}
                    />
                    <CardComponent
                        iconClass="fa-user"
                        title="Disactive Drivers"
                        count={disactiveDrivers}
                        percentage={disactiveDrivers > 15 ? "+3%" : "+1%"} // Example percentage change
                        iconStyle={{ background: 'linear-gradient(195deg, rgb(236, 64, 122), rgb(216, 27, 96))' }}
                    />
                </div>
            </div>

            <div className="drivers-table-container mt-5">
                <h3 className="table-title">Drivers Table</h3>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Control
                        type="text"
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search drivers"
                        className="search-input"
                    />
                    <Button onClick={handleShow} className="ml-3">
                        + Add Driver
                    </Button>
                </div>
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
                                <tr {...row.getRowProps()} key={row.id}> {/* Apply key directly */}
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} key={cell.column.id}> {/* Apply key directly */}
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </BSTable>
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

            <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit Driver' : 'Add Driver'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formDriverName">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Enter driver's name"
                                        value={newDriver.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDriverContact">
                                    <Form.Label>Contact *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contact"
                                        placeholder="Enter driver's contact"
                                        value={newDriver.contact}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formDriverAddress">
                                    <Form.Label>Address *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Enter driver's address"
                                        value={newDriver.address}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDrivingLicense">
                                    <Form.Label>Driving License *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="driving_license"
                                        placeholder="Enter driver's driving license"
                                        value={newDriver.driving_license}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formOwnership">
                                    <Form.Label>Ownership</Form.Label>
                                    <div className="ownership-options">
                                        <Form.Check
                                            type="radio"
                                            label="Market Driver"
                                            name="ownership"
                                            id="marketDriver"
                                            className="ownership-radio"
                                            value="marketDriver"
                                            checked={newDriver.ownership === 'marketDriver'}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="My Driver"
                                            name="ownership"
                                            id="myDriver"
                                            className="ownership-radio"
                                            value="myDriver"
                                            checked={newDriver.ownership === 'myDriver'}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={newDriver.status}
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

export default Drivers;
