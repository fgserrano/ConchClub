import React from 'react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-canvas-container border border-border rounded-2xl p-6 max-w-sm w-full hard-shadow animate-in zoom-in-95 duration-200">
                <h3 className="font-serif text-xl font-semibold text-canvas-foreground mb-2">{title}</h3>
                <p className="text-canvas-muted-foreground text-sm mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-canvas-muted-foreground hover:text-canvas-foreground font-medium hover:bg-canvas-container rounded-lg transition-colors text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-oxblood-container hover:bg-oxblood-deep text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors hard-shadow"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
