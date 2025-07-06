import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Form, Alert, Spinner } from 'react-bootstrap';
import {
    getRecords,
    deleteRecord,
    bulkDeleteRecords,
    filterRecordsByActive,
    searchRecordsByName
} from '../services/api';
import { useNavigate } from 'react-router-dom';

function RecordList() {
    const [records, setRecords] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterActive, setFilterActive] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadRecords = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getRecords();
            setRecords(res.data);
        } catch (err) {
            setError('Failed to load records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await deleteRecord(id);
            setMessage('Record deleted successfully!');
            loadRecords();
        } catch (err) {
            setError('Error deleting record.');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            setError('No records selected for deletion.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete selected records?')) return;
        try {
            await bulkDeleteRecords(selectedIds);
            setMessage('Selected records deleted successfully!');
            setSelectedIds([]);
            loadRecords();
        } catch (err) {
            setError('Error deleting selected records.');
        }
    };

    const handleFilter = async () => {
        setLoading(true);
        setError('');
        try {
            if (filterActive === '') {
                await loadRecords();
            } else {
                const res = await filterRecordsByActive(filterActive === 'true');
                setRecords(res.data);
            }
        } catch (err) {
            setError('Error filtering records.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            if (search.trim() === '') {
                await loadRecords();
            } else {
                const res = await searchRecordsByName(search);
                setRecords(res.data);
            }
        } catch (err) {
            setError('Error searching records.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <Container className="mt-2">
            <h3 className="mb-3">Record List</h3>
            {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            <div className="d-flex mb-3 flex-wrap gap-2">
                <Form.Control
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '200px' }}
                />
                <Button onClick={handleSearch} variant="secondary">Search</Button>
                <Form.Select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    style={{ maxWidth: '150px' }}
                >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </Form.Select>
                <Button onClick={handleFilter} variant="secondary">Filter</Button>
                <Button onClick={handleBulkDelete} variant="danger">Delete Selected</Button>
                <Button variant="primary" onClick={() => navigate('/add-record')}>Add Record</Button>
            </div>

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">No records found.</td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedIds.includes(record.id)}
                                            onChange={() => handleSelect(record.id)}
                                        />
                                    </td>
                                    <td>{record.name}</td>
                                    <td>{record.description}</td>
                                    <td>{record.category?.name || 'N/A'}</td>
                                    <td>{record.active ? 'Yes' : 'No'}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => navigate(`/edit-record/${record.id}`)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(record.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default RecordList;
