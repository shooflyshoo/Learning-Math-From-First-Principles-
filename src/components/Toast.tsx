import { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (message: string, options?: {
    type?: 'success' | 'info' | 'warning';
    icon?: string;
    action?: { label: string; onClick: () => void };
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let nextId = 0;

  const showToast = useCallback((message: string, options?: {
    type?: 'success' | 'info' | 'warning';
    icon?: string;
    action?: { label: string; onClick: () => void };
    duration?: number;
  }) => {
    const id = nextId++;
    const toast: ToastMessage = {
      id,
      message,
      type: options?.type || 'info',
      icon: options?.icon,
      action: options?.action,
    };

    setToasts(prev => [...prev, toast]);

    // Auto-dismiss after duration (default 3s)
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, options?.duration || 3000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container - fixed at bottom of screen */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`
                pointer-events-auto
                px-4 py-3 rounded-lg shadow-lg
                flex items-center gap-3
                sm:min-w-[300px] sm:max-w-[400px]
                ${toast.type === 'success' ? 'bg-green-600' : ''}
                ${toast.type === 'info' ? 'bg-blue-600' : ''}
                ${toast.type === 'warning' ? 'bg-yellow-600' : ''}
              `}
            >
              {toast.icon && <span className="text-xl">{toast.icon}</span>}
              <span className="flex-1 text-white text-sm font-medium">{toast.message}</span>
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    dismissToast(toast.id);
                  }}
                  className="text-white/80 hover:text-white text-sm underline"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-white/60 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
