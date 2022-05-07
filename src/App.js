import { Box, Container, Typography } from '@mui/material';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [hitId, setHitId] = useState(-1);
  const [cause, setCause] = useState('cause');
  const [effect, setEffect] = useState('effect');
  const [question, setQuestion] = useState('question');
	const [passage, setPassage] = useState('passage');
	const [article, setArticle] = useState('article');
	const [worker_id, setWorkerId] = useState('worker_id');

  const handleError = () => {
    setCause('Error retrieving next hit (maybe DB empty?)');
    setEffect('Error retrieving next hit (maybe DB empty?)');
    setQuestion('Error retrieving next hit (maybe DB empty?)');
		setPassage('Error retrieving next hit (maybe DB empty?)');
  }

  const getHit = () => {
    fetch('https://the.mturk.monster:50000/api/get_hit/null')
      .then(r => r.json())
      .then(r => {
        if (r.error) {
          handleError();
        }

        setHitId(r.hit.id);
        setCause(r.hit.cause);
        setEffect(r.hit.effect);
        setQuestion(r.hit.question);
				setWorkerId("WORKER_ID");

				const c_patterns = ['because', 'Because', 'due to', 'Due to', 'therefore', 'Therefore', 'consequently', 'Consequently', 'resulted in', 'Resulted in', 'Resulting in', 'resulting in', 'as a result', 'As a result'];
				const passage = r.hit.passage;
				let final_passage = passage;
				for(var i = 0; i < c_patterns.length; i++) {
					if(passage.includes(c_patterns[i])) {
						var highlight = "<span style='background-color:#FFFF00'>" + c_patterns[i] + "</span>";
						final_passage = final_passage.replace(c_patterns[i], highlight);
					}
				}
				setPassage(final_passage);

				const article_url = "https://en.wikipedia.org/wiki/" + r.article.title;
				const article_html = "<a href='" + article_url + "'>" + article_url+ "</a>";
				setArticle(article_html);
      })
      .catch(() => handleError());
  }

  const handleSubmit = (r) => {
    fetch(`https://the.mturk.monster:50000/api/eval_hit/${document.getElementById("hitid").textContent}/${r}`, { method: 'POST' });
    getHit();
  }

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      getHit();
    } else if (e.key === '[') {
      handleSubmit("good");
    } else if (e.key === ']') {
      handleSubmit("bad");
    }
  }

	const getWorkerInfo = () => {
		var endpoint = 'https://the.mturk.monster:50000/api/check_worker_info/' + worker_id;
		fetch(endpoint)
			.then(r => r.json())
			.then(r => {

			})
			.catch(() => {});
	}

	const worker_stats = {
		submits: 15,
		checked_status: "checked",
		bad_count: 5,
	}

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
  }, []);

  return (
			<Container>
				<Box style={{ padding: '10vh' }}>
					<Typography variant="h2" component="h1" style={{ textAlign: 'center' }}>
						CausalQA Validation
					</Typography>

					<div className="instructions">
						<Typography variant="h5" component="h1" className='subtitle'>
							Space = New Question
						</Typography>
						<Typography variant="h5" component="h1" className='subtitle'>
							[ = Approve
						</Typography>
						<Typography variant="h5" component="h1" className='subtitle'>
							] = Reject
						</Typography>
					</div>

					<Row>
						<Col>
							<Typography variant="subtitle1" component="h1" className='subtitle'>
								Worker Information
							</Typography>
								<table>
									<tbody>
										<tr>
											<td>Submits</td>
											<td>{worker_stats.submits}</td>
										</tr>
										<tr>
											<td>Checked Status</td>
											<td>{worker_stats.checked_status}</td>
										</tr>
										<tr>
											<td>Bad Count</td>
											<td>{worker_stats.bad_count}</td>
										</tr>
									</tbody>
								</table>
						</Col>
						<Col>
						<Box style={{ padding: '5vh' }}>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>ID:</Typography>
							<Typography variant="body1" id="hitid" component="p" style={{ marginBottom: '0.5em' }}>{hitId}</Typography>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Article:</Typography>
							<Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }} dangerouslySetInnerHTML={{ __html: article}}></Typography>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Passage:</Typography>
							<Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }} dangerouslySetInnerHTML={{ __html: passage}}></Typography>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Cause:</Typography>
							<Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{cause}</Typography>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Effect:</Typography>
							<Typography variant="body1" component="p" style={{ marginBottom: '0.5em' }}>{effect}</Typography>
							<Typography variant="subtitle1" component="h1" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Question:</Typography>
							<Typography variant="body1" component="p" style={{ marginBottom: '5vh' }}>{question}</Typography>
							{/* <TextField
								id="textfield"
								style={{ width: '100%' }}
								value={reason}
								onChange={handleReasonChange}
								onKeyDown={handleKeyDown}>
								{reason}
							</TextField> */}
						</Box>
						</Col>
					</Row>
				</Box>
			</Container>

  );
}

export default App;
