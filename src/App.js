import HelpIcon from '@mui/icons-material/Help';
import { Box, Container, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cause, setCause] = useState('cause');
  const [effect, setEffect] = useState('effect');
  const [question, setQuestion] = useState('question');
  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  }

  const handleSubmit = (r) => {
    if (r === '') {
      console.log("approve");
    } else {
      console.log("reject:", r);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(reason);
      setReason('');
    }
  }

  return (
    <Container>
      <Box style={{ padding: '10vh' }}>
        <Typography variant="h2" component="h1" style={{ textAlign: 'center' }}>
          CausalQA Validation
        </Typography>

        <Typography variant="h5" component="h1" className='subtitle'>
          Enter to approve, start typing to reject with reason.
          <Tooltip title="Click on the textbox below to begin validations. Press enter to submit. If the textbox is empty, the submission will be an approval; if the textbox is not empty, that will be the provided reason for rejection. ">
            <HelpIcon />
          </Tooltip>
        </Typography>

        <Box style={{ padding: '5vh' }}>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Cause:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{cause}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Effect:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{effect}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Question:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '5vh' }}>{question}</Typography>
          <TextField
            id="textfield"
            style={{ width: '100%' }}
            value={reason}
            onChange={handleReasonChange}
            onKeyDown={handleKeyDown}>
            {reason}
          </TextField>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
