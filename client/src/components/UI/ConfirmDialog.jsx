import React from 'react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b00]/50 backdrop-blur-[12px] animate-in fade-in duration-200">
            <div className="bg-surface rounded-sm p-6 max-w-sm w-full shadow-[0_24px_48px_rgba(33,27,0,0.06)] border border-outline-variant/15 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-display font-bold text-on-surface mb-2">{title}</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container rounded-sm transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-primary text-on-primary font-display font-bold rounded-sm hover:bg-primary-container transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
