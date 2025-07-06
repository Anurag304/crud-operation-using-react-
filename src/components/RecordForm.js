import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, createRecord, getRecordById, updateRecord } from '../services/api';

function RecordForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        active: false
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    // Edit Mode: Fetch the record, and set only its category
                    const recRes = await getRecordById(id);
                    setFormData({
                        name: recRes.data.name,
                        description: recRes.data.description,
                        category: recRes.data.category.id,
                        active: recRes.data.active
                    });
                    setCategories([recRes.data.category]); // Only that category
                } else {
                    // Add Mode: Fetch all categories
                    const catRes = await fetchCategories();
                    setCategories(catRes.data);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load categories or record.');
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            category: { id: formData.category }
        };
        try {
            if (id) {
                await updateRecord(id, payload);
                setMessage("✅ Record updated successfully!");
            } else {
                await createRecord(payload);
                setMessage("✅ Record created successfully!");
                setFormData({
                    name: '',
                    description: '',
                    category: '',
                    active: false
                });
            }
            setTimeout(() => navigate("/records"), 1000);
        } catch (err) {
            console.error(err);
            setError("❌ Error while saving record.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '500px', padding: '20px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">{id ? "Edit Record" : "Add Record"}</Card.Title>
                    {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                    {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">
                            {id ? "Update Record" : "Create Record"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default RecordForm;
