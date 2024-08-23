//Weather.js
import React from 'react';
import Weatherbox from '../components/Weatherbox';
import styled from 'styled-components';
import axios from 'axios';
import { BsThermometerSun, BsFillDropletFill, BsCloudFog2Fill } from "react-icons/bs";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Weather = () => {
  // 샘플 데이터 (실제 데이터는 API 호출로 가져올 수 있습니다)
  const data = {
    temperature: '25°C',
    humidity: '60%',
    windDirection: 'N',
    windSpeed: '15 km/h',
    precipitation: 'No',
  };

  return (
    <DashboardContainer>
      <Weatherbox label="최고/최저 기온" value={data.temperature} />
      <Weatherbox label="습도" value={data.humidity} />
      <Weatherbox label="풍향" value={data.windDirection} />
      <Weatherbox label="풍속" value={data.windSpeed} />
      <Weatherbox label="강수량" value={data.precipitation} />
    </DashboardContainer>
  );
};

export default Weather;

