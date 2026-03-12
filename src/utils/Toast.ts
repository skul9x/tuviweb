
export class Toast {
    public static show(message: string, duration: number = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification glass-card';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: rgba(26, 26, 26, 0.9);
            border: 1px solid var(--gold-primary);
            color: var(--gold-secondary);
            border-radius: var(--radius-md);
            z-index: 9999;
            box-shadow: 0 0 15px var(--gold-glow);
            transform: translateY(100px);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
        `;
        
        toast.innerHTML = `<span>✨</span> ${message}`;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Hide and remove
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
}
