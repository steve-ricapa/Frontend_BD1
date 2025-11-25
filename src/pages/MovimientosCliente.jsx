import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import { db } from '../lib/db';

export default function MovimientosCliente() {
    const [cliente, setCliente] = useState(null);
    const [transacciones, setTransacciones] = useState([]);
    const [cuentasCliente, setCuentasCliente] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        const c = JSON.parse(storedCliente);
        setCliente(c);

        // Cargar cuentas del cliente
        db.query('SELECT nrocuenta FROM cuenta WHERE idcliente = $1', [c.idcliente])
            .then(res => setCuentasCliente(res.rows.map(r => r.nrocuenta)));

        db.query(`
      SELECT DISTINCT t.*
      FROM transaccion t
      LEFT JOIN cuenta ct_origen ON t.nrocuenta_origen = ct_origen.nrocuenta
      LEFT JOIN cuenta ct_destino ON t.nrocuenta_destino = ct_destino.nrocuenta
      WHERE ct_origen.idcliente = $1 OR ct_destino.idcliente = $1
      ORDER BY fecha DESC
      LIMIT 100
    `, [c.idcliente]).then(res => setTransacciones(res.rows));
    }, [navigate]);

    // Función para determinar si es entrada de dinero
    const esEntrada = (tx) => {
        // Si es transferencia y la cuenta destino es del cliente, es entrada
        if (tx.tipo === 'transferencia' && cuentasCliente.includes(tx.nrocuenta_destino)) {
            return true;
        }
        // Si es depósito, es entrada
        if (tx.tipo === 'deposito') {
            return true;
        }
        return false;
    };

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-interbank-blue mb-6">Mis Movimientos</h1>
                <Card>
                    <Table headers={['Fecha', 'Tipo', 'Canal', 'Destino', 'Monto']}>
                        {transacciones.map(tx => {
                            const isIncoming = esEntrada(tx);
                            return (
                                <tr key={tx.idtransaccion} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-PE') : '-'}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isIncoming ? 'bg-green-100 text-green-800' :
                                                tx.tipo === 'retiro' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {tx.tipo || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{tx.canal || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {tx.tipo === 'transferencia' ? (tx.nrocuenta_destino || '-') : '-'}
                                    </td>
                                    <td className={`px-6 py-4 font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                                        {isIncoming ? '+' : '-'} S/ {parseFloat(tx.monto || 0).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </Card>
            </div>
        </div>
    );
}
