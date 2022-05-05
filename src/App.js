import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import './App.css';

function App() {
  const [cause, setCause] = useState('cause');
  const [effect, setEffect] = useState('effect');
  const [question, setQuestion] = useState('question');
  const [answer, setAnswer] = useState('answer');

  return (
    <Container>
      <Box style={{ padding: '10vh' }}>
        <Typography variant="h2" component="h1" style={{ textAlign: 'center' }}>
          CausalQA Validation
        </Typography>

        <Typography variant="h5" component="h1" style={{ textAlign: 'center', marginBottom: '1em' }}>
          Enter to approve, start typing to reject with reason.
        </Typography>

        <Box>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>Cause:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{cause}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>Effect:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{effect}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>Question:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{question}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>Answer:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{answer}</Typography>
        </Box>

      </Box>
    </Container>
  );
}

export default App;
