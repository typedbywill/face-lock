import React, { useState, useEffect } from 'react';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            if (window.api && window.api.getLogs) {
                const data = await window.api.getLogs();
                setLogs(data);
            } else {
                console.warn('API getLogs not found (running in browser?)');
                // Mock data for dev if needed, or just empty
                setLogs([]);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();

        // Auto refresh every 5s? Or just manual. Let's start with manual refresh button.
    }, []);

    return (
        <div className="p-6 text-gray-100 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Histórico de Bloqueios
                </h1>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                </button>
            </div>

            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 bg-gray-800/80">
                                <th className="px-6 py-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Data / Hora</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Gatilho</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                                            Carregando logs...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log.id || index} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${log.trigger === 'USER_AWAY' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50' :
                                                    log.trigger === 'MANUAL' ? 'bg-blue-900/50 text-blue-200 border border-blue-700/50' :
                                                        'bg-gray-700 text-gray-300'}`}>
                                                {log.trigger}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            Id: {log.id}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Logs;
