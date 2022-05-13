import {
  Button, FormControlLabel, Stack, Switch,
} from '@mui/material';
import React, { useState } from 'react';

export function MarkAllBtns(props) {
  const [workerEval, setWorkerEval] = useState(true);

  function handleClick(id, wid, action) {
    // alert(`Worker: ${id}, Action: ${action}`);
    fetch(`https://the.mturk.monster:50000/api/eval_all_s1_by/${id}/${action}`, { method: 'POST' });

    if (action === 'bad') {
        // reject all also blocks worker
        fetch(`https://the.mturk.monster:50000/api/update_checked_status/${wid}/blocked`);
    }

    // reset lock
    setWorkerEval(true);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stack spacing={4}>
        <Stack spacing={2} direction="row">
          <Button variant="outlined" color="info" disabled={workerEval} onClick={() => handleClick(props.workerId, props.mturkId, 'good')}>
            Approve all HITs by worker
          </Button>
          <Button variant="outlined" color="error" disabled={workerEval} onClick={() => handleClick(props.workerId, props.mturkId, 'bad')}>
            Reject all HITs by worker
          </Button>
          <FormControlLabel control={<Switch onChange={() => setWorkerEval(!workerEval)} />} label="Safety Toggle" />
        </Stack>
      </Stack>
    </div>
  );
}
