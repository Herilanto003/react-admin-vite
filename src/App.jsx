import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Clients from './pages/Clients';
import AddClients from './pages/AddClients';
import Rooms from './pages/Rooms';
import AddRooms from './pages/AddRooms';
import Reservations from './pages/Reservations';
import AddReservations from './pages/AddReservations';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const App = () => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Login />} />
                <Route path='/my-account/customers' element={<Clients />} />
                <Route path='/my-account/customers/new' element={<AddClients />} />
                <Route path='/my-account/rooms' element={<Rooms />} />
                <Route path='/my-account/rooms/new' element={<AddRooms />} />
                <Route path='/my-account/books' element={<Reservations />} />
                <Route path='/my-account/books/new' element={<AddReservations />} />
                <Route path='/my-account/dashboard' element={<Dashboard />} />
                <Route path='/my-account/' element={<Dashboard />} />
                <Route path='/my-account/calendar' element={<Calendar />} />
            </Routes>
        </Router>
    );
}

export default App;
