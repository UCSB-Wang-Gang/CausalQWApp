import { DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';

export function EditModal(props) {
  const handleClose = () => {
    props.setModalShow(false);
  };

  const submitEdits = () => {
    props.submitEdits(props.stage, props.id, props.title, props.value);
    handleClose();
  };

  return (
    <Dialog
      PaperProps={{
        className: 'tony',
        style: { width: '80vw', maxWidth: '100vw' },
      }}
      open={props.modalShow}
      onClose={handleClose}
    >
      <DialogTitle>Edit {props.title}</DialogTitle>
      <DialogContent>
        <TextField
          className="tony"
          variant="outlined"
          style={{ width: '100%', backgroundColor: 'white' }}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          className="tony"
          onClick={submitEdits}
          style={{
            backgroundColor: 'white',
            border: '1px solid black',
            color: 'black',
          }}
        >Submit Edits
        </Button>
      </DialogActions>
    </Dialog>
  );
}
