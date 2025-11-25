import React from 'react';

export default function Table({ headers, children }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-interbank-blue text-white uppercase text-xs font-semibold">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-4">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {children}
                </tbody>
            </table>
        </div>
    );
}
