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
        <div className="p-6 text-neutral-200 h-full overflow-y-auto font-sans">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-neutral-100">
                    Histórico de Bloqueios
                </h1>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors flex items-center gap-2 text-neutral-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                </button>
            </div>

            <div className="bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-800 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-neutral-800/80">
                                <th className="px-6 py-4 font-semibold text-neutral-400 text-sm uppercase tracking-wider">Data / Hora</th>
                                <th className="px-6 py-4 font-semibold text-neutral-400 text-sm uppercase tracking-wider">Gatilho</th>
                                <th className="px-6 py-4 font-semibold text-neutral-400 text-sm uppercase tracking-wider">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-neutral-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-400"></div>
                                            Carregando logs...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-neutral-500">
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log.id || index} className="hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 text-neutral-300 font-mono text-sm">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${log.trigger === 'USER_AWAY' ? 'bg-amber-900/40 text-amber-200 border border-amber-700/30' :
                                                    log.trigger === 'MANUAL' ? 'bg-sky-900/40 text-sky-200 border border-sky-700/30' :
                                                        'bg-neutral-700 text-neutral-300'}`}>
                                                {log.trigger}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 text-sm font-mono">
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
