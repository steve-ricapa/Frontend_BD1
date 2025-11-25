import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { db } from '../lib/db';

export default function PrestamosCliente() {
    const [cliente, setCliente] = useState(null);
    const [prestamos, setPrestamos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        const c = JSON.parse(storedCliente);
        setCliente(c);

        db.query('SELECT * FROM prestamo WHERE idcliente = $1', [c.idcliente])
            .then(res => setPrestamos(res.rows));
    }, [navigate]);

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-interbank-blue mb-6">Mis Préstamos</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {prestamos.map(p => (
                        <Card key={p.idprestamo} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-interbank-green text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                                {p.estado}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Préstamo Personal</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Monto Original</span>
                                    <span className="font-bold">S/ {parseFloat(p.monto || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Saldo Pendiente</span>
                                    <span className="font-bold text-interbank-blue">S/ {parseFloat(p.saldo_pendiente || 0).toFixed(2)}</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                                    <div
                                        className="bg-interbank-blue h-3 rounded-full transition-all duration-1000"
                                        style={{ width: `${(1 - p.saldo_pendiente / p.monto) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-center text-gray-500">
                                    {Math.round((1 - p.saldo_pendiente / p.monto) * 100)}% Pagado
                                </div>
                            </div>
                        </Card>
                    ))}
                    {prestamos.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                            No tienes préstamos activos actualmente.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
