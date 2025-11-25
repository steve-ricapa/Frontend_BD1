import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { db } from '../lib/db';

export default function CuentasCliente() {
    const [cliente, setCliente] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        const c = JSON.parse(storedCliente);
        setCliente(c);

        db.query('SELECT * FROM cuenta WHERE idcliente = $1', [c.idcliente])
            .then(res => setCuentas(res.rows));
    }, [navigate]);

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-interbank-blue mb-6">Mis Cuentas</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {cuentas.map(cta => (
                        <Card key={cta.nrocuenta} className="hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{cta.tipo}</h3>
                                    <p className="text-gray-500">{cta.nrocuenta}</p>
                                </div>
                                <div className="bg-blue-50 text-interbank-blue px-3 py-1 rounded-full text-xs font-bold">
                                    Activa
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                S/ {parseFloat(cta.saldo || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">Saldo Disponible</div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
