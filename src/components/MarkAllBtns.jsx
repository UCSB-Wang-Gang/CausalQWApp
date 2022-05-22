import {
  Button, FormControlLabel, Stack, Switch,
} from '@mui/material';
import React, { useState } from 'react';

export function MarkAllBtns(props) {
  const [workerEval, setWorkerEval] = useState(true);

  function handleClick(id, wid, action) {
    // alert(`Worker: ${id}, Action: ${action}`);
    fetch(`https://the.mturk.monster:50000/api/eval_all_s${props.stage}_by/${id}/${action}`, { method: 'POST' });

    if (action === 'bad') {
      // reject all also blocks worker
      fetch(`https://the.mturk.monster:50000/api/update_checked_status/${wid}/blocked`);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stack spacing={4}>
        <Stack spacing={2} direction="row">
          <Button className="tony" variant="outlined" color="info" disabled={workerEval} onClick={() => handleClick(props.workerId, props.mturkId, 'ok')}>
            Approve all HITs by worker
          </Button>
          <Button className="tony" variant="outlined" color="error" disabled={workerEval} onClick={() => handleClick(props.workerId, props.mturkId, 'bad')}>
            Reject all HITs by worker
          </Button>
          <FormControlLabel control={<Switch onChange={() => setWorkerEval(!workerEval)} />} label="Safety Toggle" />
        </Stack>
      </Stack>
    </div>
  );
}
