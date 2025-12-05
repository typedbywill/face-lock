import React, { useState, useEffect, useRef } from 'react';
import { Camera, Shield, ShieldAlert, UserPlus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

function App() {
    const [isRunning, setIsRunning] = useState(false);
    const [faces, setFaces] = useState([]);
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'add'
    const [newFaceName, setNewFaceName] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        updateStatus();
        updateFaces();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async () => {
        const status = await window.api.getStatus();
        setIsRunning(status);
    };

    const updateFaces = async () => {
        const list = await window.api.getFaces();
        setFaces(list);
    };

    const toggleMonitor = async () => {
        if (isRunning) {
            await window.api.stopMonitor();
        } else {
            await window.api.startMonitor();
        }
        updateStatus();
    };

    const removeFace = async (id) => {
        if (confirm('Remover este rosto?')) {
            await window.api.removeFace(id);
            updateFaces();
        }
    };

    // --- Add Face Logic ---

    const startCamera = async () => {
        try {
            if (isRunning) {
                await window.api.stopMonitor();
                updateStatus();
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("Erro ao acessar câmera: " + err.message);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        if (view === 'add') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [view]);

    const handleCapture = async () => {
        if (!newFaceName.trim()) {
            alert("Digite um nome!");
            return;
        }

        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const base64 = canvas.toDataURL('image/jpeg');

        const result = await window.api.addFace({
            name: newFaceName,
            imageBase64: base64
        });

        setIsCapturing(false);

        if (result.success) {
            setNewFaceName('');
            setView('dashboard');
            updateFaces();
        } else {
            alert("Erro: " + result.error);
        }
    };

    // --- RENDER ---

    const renderDashboard = () => (
        <div className="max-w-2xl mx-auto p-8 font-sans text-neutral-200">
            <header className="mb-10 flex justify-between items-center border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-neutral-100" />
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
                        Auto Lock
                    </h1>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isRunning
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}>
                    {isRunning ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Monitorando
                        </>
                    ) : (
                        'Pausado'
                    )}
                </div>
            </header>

            <div className="grid gap-6">
                {/* Status Card */}
                <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-800 flex items-center justify-between transition-colors hover:border-neutral-700">
                    <div>
                        <h2 className="text-base font-medium text-neutral-200">Monitoramento</h2>
                        <p className="text-sm text-neutral-500 mt-1">Ative para bloquear a tela quando você sair.</p>
                    </div>
                    <button
                        onClick={toggleMonitor}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isRunning
                                ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                                : 'bg-neutral-100 text-neutral-900 hover:bg-white'
                            }`}
                    >
                        {isRunning ? 'Parar' : 'Iniciar'}
                    </button>
                </div>

                {/* Users List */}
                <div className="bg-neutral-800/50 rounded-xl border border-neutral-800 overflow-hidden">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/30">
                        <h2 className="text-base font-medium text-neutral-200">Rostos Cadastrados</h2>
                        <button
                            onClick={() => setView('add')}
                            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Adicionar</span>
                        </button>
                    </div>

                    {faces.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500 flex flex-col items-center gap-3">
                            <ShieldAlert className="w-10 h-10 opacity-20" />
                            <p className="text-sm">Nenhum rosto cadastrado.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-800">
                            {faces.map(face => (
                                <li key={face.id} className="flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-300">
                                            {face.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-neutral-200">{face.name}</div>
                                            <div className="text-xs text-neutral-500 font-mono">ID: {face.id.substring(0, 6)}...</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFace(face.id)}
                                        className="text-neutral-600 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAddFace = () => (
        <div className="max-w-xl mx-auto p-8 h-screen flex flex-col font-sans text-neutral-200">
            <header className="mb-8">
                <button
                    onClick={() => setView('dashboard')}
                    className="text-neutral-500 hover:text-neutral-200 flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <h1 className="text-xl font-semibold text-neutral-100">Novo Cadastro</h1>
                <p className="text-neutral-500 text-sm mt-1">Posicione o rosto centralizado na câmera</p>
            </header>

            <div className="flex-1 flex flex-col gap-6">
                <div className="relative w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1] opacity-90"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Overlay Guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-64 border border-neutral-500/30 rounded-full"></div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newFaceName}
                        onChange={e => setNewFaceName(e.target.value)}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 text-sm placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors"
                        placeholder="Nome da Pessoa"
                        onKeyDown={e => e.key === 'Enter' && handleCapture()}
                    />
                    <button
                        onClick={handleCapture}
                        disabled={isCapturing}
                        className={`px-6 rounded-lg font-medium text-sm flex items-center gap-2 min-w-[120px] justify-center transition-all ${isCapturing
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-neutral-100 text-neutral-900 hover:bg-white'
                            }`}
                    >
                        {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        <span>{isCapturing ? 'Sal...' : 'Salvar'}</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 selection:bg-neutral-700 selection:text-neutral-200">
            {view === 'dashboard' ? renderDashboard() : renderAddFace()}
        </div>
    );
}

export default App;
