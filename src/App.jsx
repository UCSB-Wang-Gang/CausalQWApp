import {
  Accordion, AccordionDetails, AccordionSummary, Box, Container, TextField, Typography,
} from '@mui/material';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { MarkAllBtns } from './components/MarkAllBtns';
import { Navbar } from './components/Navbar';

function App() {
  const [hitId, setHitId] = useState(-1);
  const [cause, setCause] = useState('cause');
  const [effect, setEffect] = useState('effect');
  const [question, setQuestion] = useState('question');
  const [passage, setPassage] = useState('passage');
  const [article, setArticle] = useState('article');
  const [explanation, setExplanation] = useState('explanation');
  const [expanded, setExpanded] = useState(false);
  const [stage, setStage] = useState(1);

  const [worker_id, setWorkerId] = useState('worker_id');
  const [mturk_id, setMturkId] = useState('mturk_id');
  const [worker_hits, setWorkerHits] = useState('worker_hits');
  const [worker_status, setWorkerStatus] = useState('worker_status');
  const [good_count, setGoodCount] = useState('good_count');
  const [bad_count, setBadCount] = useState('bad_count');

  const inputRef = useRef();

  const handleError = () => {
    setCause('Error retrieving next hit (maybe DB empty?)');
    setEffect('Error retrieving next hit (maybe DB empty?)');
    setQuestion('Error retrieving next hit (maybe DB empty?)');
    setPassage('Error retrieving next hit (maybe DB empty?)');
    setArticle('Error retrieving next hit (maybe DB empty?)');
    setExplanation('Error retrieving next hit (maybe DB empty?)');
  };

  // const endpoints = ['get_s1_ordered', 'get_hit/null/render_worker_stats'];

  const getHit = () => {
    const endpoint = 'get_s1_ordered';
    // const endpoint = 'get_hit/null/render_worker_stats';
    fetch(`https://the.mturk.monster:50000/api/${endpoint}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          handleError();
        }

        setHitId(r.hit.id);
        setCause(r.hit.cause);
        setEffect(r.hit.effect);
        setQuestion(r.hit.question);

        const c_patterns = ['because', 'Because', 'due to', 'Due to', 'therefore', 'Therefore', 'consequently', 'Consequently', 'resulted in', 'Resulted in', 'Resulting in', 'resulting in', 'as a result', 'As a result'];
        let final_passage = r.hit.passage;
        for (let i = 0; i < c_patterns.length; i++) {
          if (final_passage.includes(c_patterns[i])) {
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
      })
      .catch(() => handleError());
  };

  const getExplanation = () => {
    const endpoint = 'get_s2_ordered';
    // const endpoint = 'get_hit/null/render_worker_stats';
    fetch(`https://the.mturk.monster:50000/api/${endpoint}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          handleError();
        }

        setHitId(r.explanation.id);
        setCause(r.hit.cause);
        setEffect(r.hit.effect);
        setExplanation(r.explanation.explanation);

        const c_patterns = ['because', 'Because', 'due to', 'Due to', 'therefore', 'Therefore', 'consequently', 'Consequently', 'resulted in', 'Resulted in', 'Resulting in', 'resulting in', 'as a result', 'As a result'];
        let final_passage = r.hit.passage;
        for (let i = 0; i < c_patterns.length; i++) {
          if (final_passage.includes(c_patterns[i])) {
            const highlight = `<span style='background-color:#FFFF00'>${c_patterns[i]}</span>`;
            final_passage = final_passage.replace(c_patterns[i], highlight);
          }
        }

        setPassage(final_passage);

        const article_url = `https://en.wikipedia.org/wiki/${r.article.title}`;
        const article_html = `<a href='${article_url}'>${article_url}</a>`;
        setArticle(article_html);

        setWorkerHits(r.worker.explanation_submits);
        setWorkerStatus(r.worker.bump2);
        setBadCount(r.worker.bad_s2_count);
        setGoodCount(r.worker.good_s2_count);
        setWorkerId(r.worker.id);
        setMturkId(r.worker.worker_id);
      })
      .catch(() => { handleError(); });
  };

  const getNext = () => {
    if (document.getElementById('stage1')) {
      getHit();
    } else if (document.getElementById('stage2')) {
      getExplanation();
    }
  };

  const handleSubmit = (r) => {
    const submit = (ep, body) => {
      fetch(
        `https://the.mturk.monster:50000/api/eval_${ep}/${document.getElementById('hitid').textContent}/${r}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      ).then(() => getNext()).catch(() => handleError());
    };

    if (document.getElementById('stage1')) {
      submit('hit', {
        hit: {
          validator_username: inputRef.current.value === '' ? 'guest' : inputRef.current.value,
        },
      });
      getHit();
    } else if (document.getElementById('stage2')) {
      submit('explanation', {
        explanation: {
          validator_username: inputRef.current.value === '' ? 'guest' : inputRef.current.value,
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (document.querySelector('.Mui-focused')) return;
    if (e.key === ' ') {
      if (document.getElementById('stage1')) {
        getHit();
      } else if (document.getElementById('stage2')) {
        getExplanation();
      }
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
    <>
      <Navbar setStage={setStage} getHit={getHit} getExplanation={getExplanation} />
      <Container>
        <Box style={{ padding: '80px' }}>
          <div className="instructions">
            <Typography sx={{ fontFamily: 'Monospace' }} variant="h5" component="h1" className="subtitle">
              Next: <SpaceBarIcon />  &ensp; Approve: [ &ensp; Reject: ]
            </Typography>

            <Box className="textfield-box" style={{ width: '25%' }}>
              <TextField
                className="username tony"
                id="textfield"
                label="username (no spaces or brackets)"
                variant="outlined"
                style={{ width: '100%' }}
                placeholder="annotator username"
                inputRef={inputRef}
              />
            </Box>
          </div>

          <Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em' }}>
            <b>Worker{' '}{mturk_id}:</b>{' '}&ensp; &ensp; &ensp;
            bump status:{' '}{worker_status}{' '}&ensp; &ensp; &ensp;
            total submits:{' '}{worker_hits}{' '}&ensp; &ensp; &ensp;
            num bad:{' '}{bad_count}{' '}&ensp; &ensp; &ensp;
            num good:{' '}{good_count}
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
            {stage === 1
              ? (
                <>
                  <Typography variant="subtitle1" id="stage1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Question:</Typography>
                  <Typography variant="body1" component="p" style={{ marginBottom: '1em' }}>{question}</Typography>
                </>
              )
              : (
                <>
                  <Typography variant="subtitle1" id="stage2" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Explanation:</Typography>
                  <Typography variant="body1" component="p" style={{ marginBottom: '1em' }}>{explanation}</Typography>
                </>
              )}
            <Accordion className="tony" style={{ marginBottom: '5vh' }} expanded={expanded} onClick={() => setExpanded(!expanded)}>
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
    </>
  );
}

export default App;
