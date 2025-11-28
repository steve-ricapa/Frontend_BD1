import React, { useState, useEffect } from 'react';

export default function QueryMonitor() {
    const [lastQuery, setLastQuery] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleQueryCompleted = (event) => {
            const { duration, timestamp } = event.detail;
            setLastQuery({ duration, timestamp });
            setVisible(true);

            // Optional: Hide after some time if desired, but user asked to "register times", 
            // so keeping it visible or showing a log might be better. 
            // For now, just show the last one.
        };

        window.addEventListener('query-completed', handleQueryCompleted);

        return () => {
            window.removeEventListener('query-completed', handleQueryCompleted);
        };
    }, []);

    if (!visible || !lastQuery) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-green-400 p-2 font-mono text-sm border-t border-gray-700 shadow-lg z-50 flex justify-between items-center px-6">
            <div>
                <span className="font-bold">Last Query Time:</span> {lastQuery.duration.toFixed(2)} ms
            </div>
            <div className="text-gray-500 text-xs">
                {new Date(lastQuery.timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
}
