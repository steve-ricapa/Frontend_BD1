import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPortal from './pages/AdminPortal';
import ClienteLogin from './pages/ClienteLogin';
import ClientePortal from './pages/ClientePortal';
import Transferencias from './pages/Transferencias';
import CuentasCliente from './pages/CuentasCliente';
import MovimientosCliente from './pages/MovimientosCliente';
import PrestamosCliente from './pages/PrestamosCliente';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/cliente/login" element={<ClienteLogin />} />
                <Route path="/cliente/portal" element={<ClientePortal />} />
                <Route path="/cliente/transferencias" element={<Transferencias />} />
                <Route path="/cliente/cuentas" element={<CuentasCliente />} />
                <Route path="/cliente/movimientos" element={<MovimientosCliente />} />
                <Route path="/cliente/prestamos" element={<PrestamosCliente />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
