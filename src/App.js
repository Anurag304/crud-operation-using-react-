import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';

function App() {
    return (
        <Router>
            <NavbarComponent />
            <div style={{ paddingTop: '70px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/records" element={<RecordList />} />
                    <Route path="/add-record" element={<RecordForm />} />
                    <Route path="/edit-record/:id" element={<RecordForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
