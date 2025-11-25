import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { db } from '../lib/db';

export default function Transferencias() {
    const [cliente, setCliente] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [monto, setMonto] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('cliente');
        if (!storedCliente) {
            navigate('/cliente/login');
            return;
        }
        const c = JSON.parse(storedCliente);
        setCliente(c);
        loadCuentas(c.idcliente);
    }, [navigate]);

    const loadCuentas = async (idcliente) => {
        const res = await db.query('SELECT * FROM cuenta WHERE idcliente = $1', [idcliente]);
        setCuentas(res.rows);
        if (res.rows.length > 0) setOrigen(res.rows[0].nrocuenta);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const montoFloat = parseFloat(monto);

            // 1. Insertar transacción
            await db.query(`
        INSERT INTO transaccion (tipo, monto, fecha, canal, nrocuenta_origen, nrocuenta_destino)
        VALUES ('transferencia', $1, NOW(), 'web', $2, $3)
      `, [montoFloat, origen, destino]);

            // 2. Update saldo origen
            await db.query('UPDATE cuenta SET saldo = saldo - $1 WHERE nrocuenta = $2', [montoFloat, origen]);

            // 3. Update saldo destino
            await db.query('UPDATE cuenta SET saldo = saldo + $1 WHERE nrocuenta = $2', [montoFloat, destino]);

            setSuccess(true);
            setMonto('');
            setDestino('');

            // Refresh accounts to show new balance
            loadCuentas(cliente.idcliente);

        } catch (err) {
            console.error(err);
            alert('Error al realizar la transferencia');
        } finally {
            setLoading(false);
        }
    };

    if (!cliente) return null;

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-8 flex justify-center">
                <Card className="w-full max-w-lg">
                    <h1 className="text-2xl font-bold text-interbank-blue mb-6">Realizar Transferencia</h1>

                    {success && (
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Transferencia realizada con éxito
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta de Origen</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-interbank-green outline-none bg-white"
                                value={origen}
                                onChange={(e) => setOrigen(e.target.value)}
                                required
                            >
                                {cuentas.map(c => (
                                    <option key={c.nrocuenta} value={c.nrocuenta}>
                                        {c.tipo} - {c.nrocuenta} (S/ {c.saldo.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta de Destino</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-interbank-green outline-none"
                                placeholder="Ingrese número de cuenta"
                                value={destino}
                                onChange={(e) => setDestino(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monto (S/)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-interbank-green outline-none"
                                placeholder="0.00"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/cliente/portal')}
                                className="w-1/2 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-1/2 bg-interbank-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : 'Transferir'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
