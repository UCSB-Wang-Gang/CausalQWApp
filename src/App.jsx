import {
  Accordion, AccordionDetails, AccordionSummary, Box, Container, TextField, Typography, Switch, FormControlLabel,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { MarkAllBtns } from './components/MarkAllBtns';

function App() {
  const [hitId, setHitId] = useState(-1);
  const [cause, setCause] = useState('cause');
  const [effect, setEffect] = useState('effect');
  const [question, setQuestion] = useState('question');
  const [passage, setPassage] = useState('passage');
  const [article, setArticle] = useState('article');
  const [expanded, setExpanded] = useState(false);

  const [worker_id, setWorkerId] = useState('worker_id');
  const [mturk_id, setMturkId] = useState('mturk_id');
  const [worker_hits, setWorkerHits] = useState('worker_hits');
  const [worker_status, setWorkerStatus] = useState('worker_status');
  const [good_count, setGoodCount] = useState('good_count');
  const [bad_count, setBadCount] = useState('bad_count');

  // const [topUnmarked, setTopUnmarked] = useState(false);
  const useAltGetHit = useRef(false);

  const inputRef = useRef();

  const handleError = () => {
    setCause('Error retrieving next hit (maybe DB empty?)');
    setEffect('Error retrieving next hit (maybe DB empty?)');
    setQuestion('Error retrieving next hit (maybe DB empty?)');
    setPassage('Error retrieving next hit (maybe DB empty?)');
  };

  // const endpoints = ['get_s1_ordered', 'get_hit/null/render_worker_stats']; 

  const getHit = () => {
    let endpoint = useAltGetHit.current.value ? 'get_s1_ordered' : 'get_hit/null/render_worker_stats';
    // fetch('https://the.mturk.monster:50000/api/get_hit/null/render_worker_stats')
    fetch(`https://the.mturk.monster:50000/api/${endpoint}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          handleError();
        }
        console.log(r);

        setHitId(r.hit.id);
        setCause(r.hit.cause);
        setEffect(r.hit.effect);
        setQuestion(r.hit.question);

        const c_patterns = ['because', 'Because', 'due to', 'Due to', 'therefore', 'Therefore', 'consequently', 'Consequently', 'resulted in', 'Resulted in', 'Resulting in', 'resulting in', 'as a result', 'As a result'];
        const { pass } = r.hit;
        let final_passage = pass;
        for (let i = 0; i < c_patterns.length; i++) {
          if (pass.includes(c_patterns[i])) {
            const highlight = `<span style='background-color:#FFFF00'>${c_patterns[i]}</span>`;
            final_passage = final_passage.replace(c_patterns[i], highlight);
          }
        }
        setPassage(final_passage);

        const article_url = `https://en.wikipedia.org/wiki/${r.article.title}`;
        const article_html = `<a href='${article_url}'>${article_url}</a>`;
        setArticle(article_html);

        setWorkerHits(r.worker.hit_submits);
        setWorkerStatus(r.worker.checked_status);
        setBadCount(r.worker.bad_s1_count);
        setGoodCount(r.worker.good_s1_count);
        setWorkerId(r.worker.id);
        setMturkId(r.worker.worker_id);

        // console.log("here?");
      })
      .catch(() => handleError());
  };

  const handleSubmit = (r) => {
    fetch(
      `https://the.mturk.monster:50000/api/eval_hit/${document.getElementById('hitid').textContent}/${r}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hit: {
            validator_username: inputRef.current.value === '' ? 'guest' : inputRef.current.value,
          },
        }),
      },
    );
    getHit();
  };

  const handleKeyDown = (e) => {
    if (document.querySelector('.Mui-focused')) return;
    if (e.key === ' ') {
      getHit();
    } else if (e.key === '[') {
      handleSubmit('good');
    } else if (e.key === ']') {
      handleSubmit('bad');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Container>
      <Box style={{ padding: '5vh' }}>
        <div style={{ display: 'flex', alignContent: 'space-between', justifyContent: 'space-between' }}>
          <Typography variant="h2" component="h1" style={{ textAlign: 'left', fontWeight: 'bold' }}>
            CausalQA Validation
          </Typography>

          <FormControlLabel control={<Switch inputRef={useAltGetHit}/>} label="top unmarked?" />
        </div>

        <div className="instructions">
          <Typography sx={{ fontFamily: 'Monospace' }} variant="h5" component="h1" className="subtitle">
            Next: spacebar, Approve: [, Reject: ]
          </Typography>

          <Box className="textfield-box" style={{ width: '25%' }}>
            <TextField
              className="username"
              id="textfield"
              style={{ width: '100%' }}
              placeholder="annotator username"
              inputRef={inputRef}
            />
          </Box>
        </div>

        <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>
          <b>
            Worker
            {' '}
            {mturk_id}
            :
          </b>
          {' '}
          &ensp; &ensp; &ensp;
          bump status:
          {' '}
          {worker_status}
          {' '}
          &ensp; &ensp; &ensp;
          total submits:
          {' '}
          {worker_hits}
          {' '}
          &ensp; &ensp; &ensp;
          num bad:
          {' '}
          {bad_count}
          {' '}
          &ensp; &ensp; &ensp;
          num good:
          {' '}
          {good_count}
        </Typography>

        <Box style={{ padding: '2vh' }}>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>ID:</Typography>
          <Typography variant="body1" id="hitid" component="p" style={{ marginBottom: '0.5em' }}>{hitId}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Article:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }} dangerouslySetInnerHTML={{ __html: article }} />
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Cause:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{cause}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Effect:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{effect}</Typography>
          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Question:</Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: '1em' }}>{question}</Typography>
          <Accordion className="passage" style={{ marginBottom: '5vh' }} expanded={expanded} onClick={() => setExpanded(!expanded)}>
            <AccordionSummary>
              <Typography variant="subtitle1" component="h1" style={{ fontWeight: 'bold' }}>Passage:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" component="p" dangerouslySetInnerHTML={{ __html: passage }} />
            </AccordionDetails>
          </Accordion>

          <MarkAllBtns mturkId={mturk_id} workerId={worker_id} />

        </Box>
      </Box>
    </Container>
  );
}

export default App;
