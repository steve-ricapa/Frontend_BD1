import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import { db } from '../lib/db';

export default function MovimientosCliente() {
    const [cliente, setCliente] = useState(null);
    const [transacciones, setTransacciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        const c = JSON.parse(storedCliente);
        setCliente(c);

        db.query(`
      SELECT t.*
      FROM transaccion t
      JOIN cuenta ct ON t.nrocuenta_origen = ct.nrocuenta
      WHERE idcliente = $1
      ORDER BY fecha DESC
      LIMIT 100
    `, [c.idcliente]).then(res => setTransacciones(res.rows));
    }, [navigate]);

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-interbank-blue mb-6">Mis Movimientos</h1>
                <Card>
                    <Table headers={['Fecha', 'Tipo', 'Canal', 'Monto']}>
                        {transacciones.map(tx => (
                            <tr key={tx.idtransaccion} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{tx.fecha}</td>
                                <td className="px-6 py-4 capitalize">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.tipo === 'deposito' ? 'bg-green-100 text-green-800' :
                                            tx.tipo === 'retiro' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {tx.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{tx.canal}</td>
                                <td className={`px-6 py-4 font-bold ${tx.tipo === 'deposito' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.tipo === 'deposito' ? '+' : '-'} S/ {tx.monto.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            </div>
        </div>
    );
}
