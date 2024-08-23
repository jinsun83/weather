

// Whether.js
import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  width: 200px;
  text-align: center;
`;

const Label = styled.h3`
  margin: 0;
  font-size: larger;
`;

const Value = styled.p`
  margin: 5px 0 0;
  font-size: medium;
`;

const WeatherBox = ({ label, value }) => (
  <Container>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Container>
);


export default WeatherBox