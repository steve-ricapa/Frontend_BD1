import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-interbank-blue text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
                    Interbank
                </Link>
                <div className="space-x-6 font-medium">
                    <Link to="/" className="hover:text-interbank-green transition-colors">Inicio</Link>
                    <Link to="/admin" className="hover:text-interbank-green transition-colors">Admin</Link>
                    <Link to="/cliente/login" className="hover:text-interbank-green transition-colors">Banca por Internet</Link>
                </div>
            </div>
        </nav>
    );
}
