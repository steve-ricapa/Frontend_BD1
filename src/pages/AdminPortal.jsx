import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import { db } from '../lib/db';

export default function AdminPortal() {
    const [transacciones, setTransacciones] = useState([]);
    const [topCuentas, setTopCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucursalId, setSucursalId] = useState(1);
    const [clienteIdSearch, setClienteIdSearch] = useState('');
    const [sugerenciaClienteId, setSugerenciaClienteId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        loadData();
        fetchSugerencia();
    }, [sucursalId, currentPage]);

    const fetchSugerencia = async () => {
        try {
            const res = await db.query('SELECT idcliente FROM cliente LIMIT 1');
            if (res.rows && res.rows.length > 0) {
                setSugerenciaClienteId(res.rows[0].idcliente);
            }
        } catch (err) {
            console.error('Error fetching suggestion:', err);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const offset = (currentPage - 1) * itemsPerPage;

            // 1. Ver TODAS las transacciones con paginación
            const txRes = await db.query(`SELECT * FROM transaccion ORDER BY fecha DESC LIMIT ${itemsPerPage} OFFSET ${offset}`);
            setTransacciones(txRes.rows);

            // Obtener total para calcular páginas
            const countRes = await db.query('SELECT COUNT(*) as total FROM transaccion');
            const total = parseInt(countRes.rows[0].total);
            setTotalPages(Math.ceil(total / itemsPerPage));

            // 3. Ver top cuentas por saldo según sucursal
            const topRes = await db.query('SELECT ct.nrocuenta, ct.saldo, c.idcliente, c.nombre FROM cuenta ct JOIN cliente c ON c.idcliente = ct.idcliente WHERE idsucursal = $1 ORDER BY saldo DESC LIMIT 50', [sucursalId]);
            setTopCuentas(topRes.rows);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchCliente = async (e) => {
        e.preventDefault();
        if (!clienteIdSearch) {
            setCurrentPage(1);
            loadData(); // Reset if empty
            return;
        }
        setLoading(true);
        try {
            const res = await db.query(`
        SELECT t.idtransaccion, t.fecha, t.tipo, t.monto, t.canal,
               t.nrocuenta_origen, t.nrocuenta_destino
        FROM transaccion t
        JOIN cuenta ct ON t.nrocuenta_origen = ct.nrocuenta
        WHERE ct.idcliente = $1
        ORDER BY t.fecha DESC
        LIMIT 100
      `, [clienteIdSearch]);
            setTransacciones(res.rows);
            setTotalPages(1); // Reset pagination for search
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-interbank-blue mb-8">Portal Administrativo</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Transactions */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Transacciones Recientes</h2>
                                <div className="flex flex-col items-end gap-1">
                                    <form onSubmit={handleSearchCliente} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="ID Cliente..."
                                            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-interbank-blue outline-none"
                                            value={clienteIdSearch}
                                            onChange={(e) => setClienteIdSearch(e.target.value)}
                                        />
                                        <button type="submit" className="bg-interbank-blue text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90">
                                            Buscar
                                        </button>
                                    </form>
                                    {sugerenciaClienteId && (
                                        <div className="text-xs text-gray-500">
                                            <span className="mr-1">Prueba con:</span>
                                            <button
                                                type="button"
                                                onClick={() => setClienteIdSearch(sugerenciaClienteId.toString())}
                                                className="text-interbank-blue font-bold hover:underline"
                                            >
                                                ID {sugerenciaClienteId}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Cargando datos...</div>
                            ) : (
                                <>
                                    <Table headers={['ID', 'Fecha', 'Tipo', 'Monto', 'Canal', 'Origen', 'Destino']}>
                                        {transacciones.map((tx) => (
                                            <tr key={tx.idtransaccion} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">#{tx.idtransaccion}</td>
                                                <td className="px-6 py-4">{tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-PE') : '-'}</td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.tipo === 'deposito' ? 'bg-green-100 text-green-800' :
                                                        tx.tipo === 'retiro' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {tx.tipo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold">S/ {parseFloat(tx.monto || 0).toFixed(2)}</td>
                                                <td className="px-6 py-4">{tx.canal}</td>
                                                <td className="px-6 py-4 text-xs">{tx.nrocuenta_origen || '-'}</td>
                                                <td className="px-6 py-4 text-xs">{tx.nrocuenta_destino || '-'}</td>
                                            </tr>
                                        ))}
                                        {transacciones.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No se encontraron transacciones</td>
                                            </tr>
                                        )}
                                    </Table>

                                    {/* Paginación */}
                                    {!clienteIdSearch && totalPages > 1 && (
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                Página {currentPage} de {totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Anterior
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Siguiente
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar - Top Accounts */}
                    <div className="space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Top Cuentas</h2>
                                <select
                                    className="border rounded-lg px-2 py-1 text-sm outline-none"
                                    value={sucursalId}
                                    onChange={(e) => setSucursalId(e.target.value)}
                                >
                                    <option value="1">Lima Centro</option>
                                    <option value="2">Miraflores</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                {topCuentas.map((cta, idx) => (
                                    <div key={cta.nrocuenta} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">{cta.nombre}</div>
                                            <div className="text-xs text-gray-500">{cta.nrocuenta}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-interbank-green">S/ {parseFloat(cta.saldo || 0).toFixed(2)}</div>
                                            <div className="text-xs text-gray-400">Saldo</div>
                                        </div>
                                    </div>
                                ))}
                                {topCuentas.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 text-sm">No hay cuentas en esta sucursal</div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
