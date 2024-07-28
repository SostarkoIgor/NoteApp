import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import './App.css';
import Navbar from './Components/Navbar.jsx'
import Authorize from './Components/Authorize.jsx';
import CreateEditNote from './Pages/CreateEditNote.jsx';
import ViewNote from './Pages/ViewNote.jsx';

function App() {
    return (<>
        <BrowserRouter>
            <Content/>
        </BrowserRouter>
    </>)
}

const Content = () => {
    const location = useLocation();
    const showNavbar = !['/login', '/register'].includes(location.pathname);

    return (
        <div>
            {showNavbar && <Authorize><Navbar /></Authorize>}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/viewnote/:id" element={<Authorize><ViewNote /></Authorize>} />
                <Route path="/createeditnote/:id?" element={<Authorize><CreateEditNote /></Authorize>} />
                <Route path="/:id?" element={<Authorize><Home /></Authorize>} />
            </Routes>
        </div>
    );
}

export default App;