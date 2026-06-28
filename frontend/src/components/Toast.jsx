import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return (
        <>
            <style>
                {`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translate(-50%, 100%); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                    .animate-slide-up {
                        animation: slideUp 0.3s ease-out;
                    }
                `}
            </style>
            <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up`}>
                <span className="text-xl">
                    {type === 'success' ? '✅' : '❌'}
                </span>
                <span className="font-semibold">{message}</span>
                <button 
                    onClick={() => { setVisible(false); if (onClose) onClose(); }}
                    className="ml-4 text-white/70 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </>
    );
};

export default Toast;