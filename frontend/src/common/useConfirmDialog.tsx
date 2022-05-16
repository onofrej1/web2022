import { Button, Dialog, DialogActions, DialogTitle, Divider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { useDeferredPromise } from './useDeferredPromise';

const useConfirmDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [element, setElement] = React.useState(null);
  const { defer, deferRef } = useDeferredPromise<boolean>();

  const handleConfirm = () => {
    setOpen(false);
    deferRef?.resolve(true);
  };

  const handleClose = () => {
    setOpen(false);
    deferRef?.resolve(false);
  };

  const confirm = async (msg: string) => {
    setMessage(msg);
    setOpen(true);
    return await defer().promise;
  };

  const RenderDialog = () => (
    <Dialog open={open} PaperProps={{ sx: { width: 400 } }} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>{message}</DialogTitle>
      <Divider />
      <DialogActions>
        <Divider />
        <Button onClick={handleConfirm} autoFocus>
          Yes
        </Button>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  React.useEffect(() => {
    setElement(document.getElementById('confirmDialog') as any);
  }, []);

  let ConfirmDialog = null;
  if (element) {
    ConfirmDialog = ReactDOM.createPortal(RenderDialog(), element);
  }
  return { ConfirmDialog, confirm };
};

export { useConfirmDialog };
