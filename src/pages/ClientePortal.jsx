import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import { db } from '../lib/db';

export default function ClientePortal() {
    const [cliente, setCliente] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        setCliente(JSON.parse(storedCliente));
    }, [navigate]);

    useEffect(() => {
        if (cliente) {
            loadData();
        }
    }, [cliente]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 2. Sus cuentas
            const cuentasRes = await db.query('SELECT * FROM cuenta WHERE idcliente = $1', [cliente.idcliente]);
            setCuentas(cuentasRes.rows);

            // 3. Sus transacciones
            const txRes = await db.query(`
        SELECT t.*
        FROM transaccion t
        JOIN cuenta ct ON t.nrocuenta_origen = ct.nrocuenta
        WHERE idcliente = $1
        ORDER BY fecha DESC
        LIMIT 100
      `, [cliente.idcliente]);
            setTransacciones(txRes.rows);

            // 5. Sus préstamos
            const prestamosRes = await db.query('SELECT * FROM prestamo WHERE idcliente = $1', [cliente.idcliente]);
            setPrestamos(prestamosRes.rows);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-interbank-blue">Hola, {cliente.nombre}</h1>
                        <p className="text-gray-600">Bienvenido a tu Banca por Internet</p>
                    </div>
                    <Link to="/cliente/transferencias" className="bg-interbank-green text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all">
                        Nueva Transferencia
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Cuentas */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Cuentas</h2>
                            <div className="grid gap-4">
                                {cuentas.map(cta => (
                                    <div key={cta.nrocuenta} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div>
                                            <div className="font-semibold text-gray-800">{cta.tipo}</div>
                                            <div className="text-sm text-gray-500">{cta.nrocuenta}</div>
                                        </div>
                                        <div className="text-xl font-bold text-interbank-blue">
                                            S/ {cta.saldo.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Transacciones Recientes */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Últimos Movimientos</h2>
                            <Table headers={['Fecha', 'Descripción', 'Monto']}>
                                {transacciones.slice(0, 5).map(tx => (
                                    <tr key={tx.idtransaccion}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tx.fecha.substring(0, 10)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 capitalize">{tx.tipo} - {tx.canal}</td>
                                        <td className={`px-6 py-4 text-sm font-bold ${tx.tipo === 'deposito' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.tipo === 'deposito' ? '+' : '-'} S/ {tx.monto.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {transacciones.length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4 text-gray-500">Sin movimientos recientes</td></tr>
                                )}
                            </Table>
                            <div className="mt-4 text-center">
                                <Link to="/cliente/movimientos" className="text-interbank-blue font-medium hover:underline">Ver todos los movimientos</Link>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Préstamos */}
                        <Card className="bg-gradient-to-br from-blue-50 to-white">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Préstamos</h2>
                            {prestamos.map(p => (
                                <div key={p.idprestamo} className="mb-4 last:mb-0">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Préstamo Personal</span>
                                        <span className="font-bold text-gray-800">S/ {p.monto}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-interbank-green h-2.5 rounded-full" style={{ width: `${(1 - p.saldo_pendiente / p.monto) * 100}%` }}></div>
                                    </div>
                                    <div className="text-xs text-right text-gray-500 mt-1">
                                        Pendiente: S/ {p.saldo_pendiente}
                                    </div>
                                </div>
                            ))}
                            {prestamos.length === 0 && <p className="text-gray-500 text-sm">No tienes préstamos activos.</p>}
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
                            <div className="space-y-2">
                                <Link to="/cliente/cuentas" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                                    Ver todas mis cuentas
                                </Link>
                                <Link to="/cliente/movimientos" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                                    Estado de cuenta
                                </Link>
                                <button onClick={() => { localStorage.removeItem('cliente'); navigate('/'); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
