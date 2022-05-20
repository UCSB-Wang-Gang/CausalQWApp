/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import {
  Bar, GridContainer, Logo, LogoImg,
} from './Navbar.styles';

export function Navbar(props) {
  const setStage1 = () => {
    props.setStage(1);
    props.getHit();
  };

  const setStage2 = () => {
    props.setStage(2);
    props.getExplanation();
  };

  return (
    <Bar>
      <GridContainer>
        <Logo>
          <LogoImg src="https://i.imgur.com/1Okm7pK.png" alt="logo" />
          CausalQA Validation
        </Logo>
      </GridContainer>
      <GridContainer style={{ marginRight: '1em' }}>
        <div className="stage-button" onClick={setStage1} style={{ marginRight: '1em' }}>
          Stage 1
        </div>
        <div className="stage-button" onClick={setStage2}>
          Stage 2
        </div>
      </GridContainer>
    </Bar>
  );
}
