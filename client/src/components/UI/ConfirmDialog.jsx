export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#201139] border-4 border-[#4f4165] shadow-[20px_20px_0px_rgba(0,0,0,0.5)] p-6 max-w-sm w-full">
                <h3 className="text-lg font-black text-[#ff80e4] neon-glow-primary uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-[#b5a4cd] text-sm mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border-2 border-[#7e6f95] text-[#b5a4cd] hover:border-[#ff80e4] hover:text-[#ff80e4] font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 border-4 border-[#ff80e4] text-[#ff80e4] hover:bg-[#ff80e4]/10 font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
