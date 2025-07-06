import React, { useState, useContext } from 'react';
import { Card, Button, Form, Container, Alert } from 'react-bootstrap';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            localStorage.setItem('token', res.data.token); // store token
            login(res.data.token); // update context
            setMessage(`Login successful. Welcome, ${res.data.name}!`);
            setError('');
            setTimeout(() => navigate('/records'), 1000);
        } catch (err) {
            setError(err.response?.data || "Error during login.");
            setMessage('');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Card style={{ width: '400px', padding: '20px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login</Card.Title>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" className="w-100" variant="primary">Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginForm;
