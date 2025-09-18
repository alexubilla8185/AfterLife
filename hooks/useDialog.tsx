import React, { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import AlertDialog, { AlertDialogProps } from '../components/ui/AlertDialog';

type DialogOptions = Omit<AlertDialogProps, 'isOpen' | 'onClose'>;

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  showError: (options: Omit<DialogOptions, 'type'>) => void;
  showConfirmation: (options: Omit<DialogOptions, 'type'>) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<AlertDialogProps | null>(null);

  const closeDialog = () => {
    setDialogState(null);
  };
  
  const showDialog = useCallback((options: DialogOptions) => {
      setDialogState({ ...options, isOpen: true, onClose: closeDialog });
  }, []);

  const showError = useCallback((options: Omit<DialogOptions, 'type'>) => {
      showDialog({ ...options, type: 'error' });
  }, [showDialog]);
  
  const showConfirmation = useCallback((options: Omit<DialogOptions, 'type'>) => {
      return new Promise<boolean>((resolve) => {
          showDialog({
              ...options,
              type: 'confirmation',
              onConfirm: () => {
                  closeDialog();
                  resolve(true);
              },
              onCancel: () => {
                  closeDialog();
                  resolve(false);
              },
          });
      });
  }, [showDialog]);


  return (
    <DialogContext.Provider value={{ showDialog, showError, showConfirmation }}>
      {children}
      {dialogState && <AlertDialog {...dialogState} />}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
