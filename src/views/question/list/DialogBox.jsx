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
  TextField,
  IconButton
} from '@mui/material'
// import { Bold, Italic, FormatSize } from '@mui/icons-material'
import Reactquill from './Reactquill'

const DialogBox = ({
  open,
  onClose,
  title,
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
  isRoleDialog
}) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }}>
      <DialogTitle>Add New Section</DialogTitle>
      <DialogContent>
        {/* Title Field */}
        <TextField label='Title *' variant='outlined' fullWidth sx={{ marginBottom: '16px' }} />

        {/* Toolbar for formatting options */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          {/* <IconButton><FormatSize /></IconButton>
          <IconButton><Bold /></IconButton>
          <IconButton><Italic /></IconButton>
          <Select defaultValue="Sans Serif" sx={{ marginRight: '8px', width: '120px' }}>
            <MenuItem value="Sans Serif">Sans Serif</MenuItem>
            <MenuItem value="Serif">Serif</MenuItem>
          </Select>
          <Select defaultValue="Normal" sx={{ width: '120px' }}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Bold">Bold</MenuItem>
            
          </Select> */}
          <Reactquill />
        </div>

        {/* Details Text Area */}
        {/* <TextField label='Details' multiline rows={4} variant='outlined' fullWidth sx={{ marginBottom: '16px' }} /> */}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='error' sx={{ height: '38px', width: '94px' }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant='contained' sx={{ height: '38px', width: '94px' }} autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogBox
