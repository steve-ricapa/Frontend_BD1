import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { db } from '../lib/db';

export default function ClienteLogin() {
    const [dni, setDni] = useState('');
    const [error, setError] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch multiple real DNIs for suggestions
        const fetchSugerencias = async () => {
            try {
                const res = await db.query('SELECT dni, nombre FROM cliente LIMIT 5');
                if (res.rows && res.rows.length > 0) {
                    setSugerencias(res.rows);
                }
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }
        };
        fetchSugerencias();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await db.query('SELECT * FROM cliente WHERE dni = $1', [dni]);
            if (res.rows.length > 0) {
                const cliente = res.rows[0];
                localStorage.setItem('cliente', JSON.stringify(cliente));
                navigate('/cliente/portal');
            } else {
                setError('DNI no encontrado.');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión');
        }
    };

    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-12 flex justify-center">
                <Card className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-interbank-blue mb-6">Banca por Internet</h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de DNI</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-interbank-green outline-none transition-all"
                                placeholder="Ingrese su DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                maxLength={8}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="w-full bg-interbank-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-md">
                            Ingresar
                        </button>

                        {sugerencias.length > 0 && (
                            <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
                                <div className="font-semibold mb-2">DNIs de prueba:</div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {sugerencias.map((cliente) => (
                                        <button
                                            key={cliente.dni}
                                            type="button"
                                            onClick={() => setDni(cliente.dni)}
                                            className="px-3 py-1 bg-blue-50 text-interbank-blue font-medium rounded-full hover:bg-blue-100 transition-colors text-xs"
                                            title={cliente.nombre}
                                        >
                                            {cliente.dni}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
}
