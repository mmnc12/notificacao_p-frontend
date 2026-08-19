// ============================================
// src/components/Toast.tsx
// ============================================

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ message, type, duration = 5000, onClose }: ToastProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosedRef = useRef(false);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    isClosedRef.current = false;

    timerRef.current = setTimeout(() => {
      if (!isClosedRef.current) {
        isClosedRef.current = true;
        onClose();
      }
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      isClosedRef.current = true;
    };
  }, [duration, onClose]);

  const handleClose = () => {
    if (!isClosedRef.current) {
      isClosedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onClose();
    }
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${colors[type]} min-w-[300px]`}>
        <span className="flex-shrink-0">{icons[type]}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="ml-auto flex-shrink-0 text-white/80 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};