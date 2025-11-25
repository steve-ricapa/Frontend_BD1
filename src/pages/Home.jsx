import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

export default function Home() {
    return (
        <div className="min-h-screen bg-interbank-gray">
            <Navbar />
            <div className="container mx-auto px-6 py-12 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-interbank-blue mb-8">Bienvenido a Interbank</h1>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <Card className="flex flex-col items-center text-center hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-interbank-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Banca por Internet</h2>
                        <p className="text-gray-600 mb-6">Accede a tus cuentas, realiza transferencias y paga tus servicios.</p>
                        <Link to="/cliente/login" className="bg-interbank-green text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all w-full">
                            Ingresar como Cliente
                        </Link>
                    </Card>

                    <Card className="flex flex-col items-center text-center hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Portal Administrativo</h2>
                        <p className="text-gray-600 mb-6">Gestión de transacciones y reportes gerenciales.</p>
                        <Link to="/admin" className="bg-interbank-blue text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all w-full">
                            Ingresar como Admin
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
