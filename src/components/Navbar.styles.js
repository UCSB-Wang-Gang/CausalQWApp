import styled from 'styled-components';

export const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 80px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 100%;
  position:fixed;
  background-color: white;
  background-image: url('https://i.imgur.com/271IzUM.png');
  background-size: 100% 100%;
  z-index: 1000;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
`;

export const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-height: 100%;
  font-size: 2em;
`;

export const LogoImg = styled.img`
  height: 1.25em;
  margin-left: 0.5em;
  margin-right: 0.25em;
`;
