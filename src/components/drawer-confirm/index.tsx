// import { Box, Button, Divider, Drawer } from '@mui/material';
// interface DrawerConfirm {
//     detail : {
//         status: boolean,
//         message: string
//     }
//     confirm: ()=> void
//     returnCloseDrawer: any
// }
// const DrawerConfirm = ({detail, confirm, returnCloseDrawer}: DrawerConfirm) => {

//     const onClose = () => {
//         return returnCloseDrawer(false)
//     }

//     return (
//         <Drawer open={detail.status} onClose={onClose} anchor="right">
//       <Box
//         sx={{
//           width: { xs: 380, sm: 550 },
//           paddingTop: 3,
//         }}
//         role="presentation"
//       >
//         {/* <Container> */}
//         <div className="flex justify-between mb-3 px-6">
//           <p className="font-bold text-xl">{detail.message}</p>
//         </div>
//         <Divider />
//         <div className='mt-6 px-3 flex flex-wrap'>
//             <div className='flex basis-full sm:basis-1/2 mb-3 sm:mb-0 flex-col px-3'>
//                 <Button variant='contained' color='error' onClick={onClose} >ไม่ใช่</Button>
//             </div>
//             <div className='flex basis-full sm:basis-1/2 mb-3 sm:mb-0 flex-col px-3'>
//                 <Button variant='contained' onClick={()=> confirm()} >ใช่</Button>
//             </div>
//         </div>
//         </Box>
//         </Drawer>
//     )
// }



// export default DrawerConfirm


import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: (result: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const ConfirmDialog = ({ open, title = "ยืนยันการทำรายการ", message, onClose, size='xs' }: ConfirmDialogProps) => {
  return (
    <Dialog 
        open={open} 
        onClose={() => onClose(false)} 
        maxWidth={size} 
        fullWidth={true}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="error">
          ไม่ใช่
        </Button>
        <Button onClick={() => onClose(true)} variant="contained">
          ใช่
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("ยืนยัน");
  const [resolveCallback, setResolveCallback] = useState<(result: boolean) => void>(() => {});

  const confirm = (message: string, title = "ยืนยัน"): Promise<boolean> => {
    return new Promise((resolve) => {
      setMessage(message);
      setTitle(title);
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    resolveCallback(result);
  };

  return [
    confirm,
    <ConfirmDialog open={isOpen} title={title} message={message} onClose={handleClose} key="confirm-dialog" />,
    // ConfirmDialogComponent: <ConfirmDialog open={isOpen} title={title} message={message} onClose={handleClose} />,
  ] as const;
};

export default useConfirm;