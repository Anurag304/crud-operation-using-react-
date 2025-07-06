import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NavbarComponent() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand as={NavLink} to="/">CRUD App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!isLoggedIn && (
                            <>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <Nav.Link as={NavLink} to="/records">View Records</Nav.Link>
                                <Nav.Link as={NavLink} to="/add-record">Add Record</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
