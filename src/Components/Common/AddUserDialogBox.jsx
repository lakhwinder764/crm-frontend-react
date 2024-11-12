import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material'

import CustomPhoneInput from './CustomPhoneInput'

const AddUserDialogBox = ({
  open,
  onClose,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  statusOptions = [],
  roleOptions = [],
  selectedStatus,
  selectedRole,
  onChangeStatus,
  onChangeRole,
  isDeleteDialog,
  isStatusDialog,
  isRoleDialog,
  isTemplateDialog,
  children
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '600px',
          maxWidth: '600px',
          ...(isTemplateDialog && {
            padding: 6
          })
        }
      }}
    >
      <DialogTitle>
        {title}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <i class='ri-close-line'></i>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default AddUserDialogBox
