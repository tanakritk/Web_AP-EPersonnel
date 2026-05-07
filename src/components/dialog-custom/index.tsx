import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

interface DialogCustomProps {
  status: boolean;
  returnOnClose: ()=>void;
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const DialogCustom = ({status, returnOnClose, title, children, size}: DialogCustomProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(status)
    const [maxWidth] = useState<DialogProps['maxWidth']>(size || 'lg');

    useEffect(()=>{
        setIsOpen(status)
    }, [status])

  return (
    <Dialog
      open={isOpen}
      onClose={()=> returnOnClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      fullWidth={true}
    >
      <DialogTitle id="alert-dialog-title" className='bg-primary text-white'>
        {/* {title} */}
        <div className='flex justify-between'>
            <span className='text-white'>{title}</span>
            <ClearIcon className='cursor-pointer' onClick={()=> returnOnClose()}/>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='mt-6'>
            {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCustom
