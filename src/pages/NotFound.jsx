import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-6xl font-bold text-interbank-blue mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
            <Link to="/" className="bg-interbank-green text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                Volver al Inicio
            </Link>
        </div>
    );
}
