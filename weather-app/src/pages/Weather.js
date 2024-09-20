import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { BsThermometerSun, BsFillDropletFill, BsCloudFog2Fill } from 'react-icons/bs';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
`;

const Header = styled.div`
  padding-top: 10px;
  font-size: 30px;
  font-weight: 800;
`;

const WeatherBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  width: 200px;
  background-color: #3EB7EC;
  gap: 1.2vh;
  padding: 10px;

  .weatherIcon {
    margin: 0;
    color: #ffffff;
    width: 42px;
    height: 40px;
  }
`;

const Text = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const Weather = () => {
  const today = new Date(); // 오늘 날짜 정보 
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // 오늘 날짜에서 1을 빼서 어제 날짜로 설정

  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');

  const yesterdayYear = yesterday.getFullYear();
  const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');

  // 기상청 API
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null); // 에러 상태 초기화
      setData(null); // 데이터 상태 초기화
      setLoading(true); // 로딩 상태 시작
      //cors걸리면 https://cors-anywhere.herokuapp.com/작성하기 + https://cors-anywhere.herokuapp.com/corsdemo접속해서 권한부여해야함.
      const response = await axios.get('https://cors-anywhere.herokuapp.com/https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
        params: {
          ServiceKey: process.env.REACT_APP_API_KEY, // 환경 변수에서 API 키 가져오기
          pageNo: 1,
          numOfRows: 290, //290개가 하루치 양
          dataType: 'JSON',
          base_date: yesterdayYear + yesterdayMonth + yesterdayDay, // 어제 날짜 사용(어제날짜로 불러야 그 다음날 0000시부터 뜸)
          base_time: 2300, // 기준 시간
          nx: 76, // x 좌표
          ny: 114, // y 좌표
        }
      });
      setData(response.data); // 데이터 설정
    } catch (e) {
      setError(e); // 에러 설정
    }
    setLoading(false); // 로딩 상태 종료
  };

  useEffect(() => {
    fetchData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

  useEffect(() => {
    console.log(data); // 데이터 출력
  }, [data]); // data가 변경될 때마다 실행

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!data) return null;

  // 필요한 정보 추출
  const extractedData = data.response.body.items.item.reduce((acc, cur) => {
    if (cur.category === 'TMX') acc.TMX = cur.fcstValue; // 최고기온
    if (cur.category === 'TMN') acc.TMN = cur.fcstValue; // 최저기온
    if (cur.fcstTime === '0000') {
      if (cur.category === 'REH') acc.REH = cur.fcstValue; // 습도 %
      if (cur.category === 'VEC') acc.VEC = cur.fcstValue; // 풍향 deg(각도로 값을 주기 때문에 문자열로 바꿔줘야함)
      if (cur.category === 'WSD') acc.WSD = cur.fcstValue; // 풍속 m/s
      if (cur.category === 'POP') acc.POP = cur.fcstValue; // 강수확률 %
    }
    return acc;
  }, {});

  // 풍향을 방위로 변환하는 함수
  const getDirection = (degree) => {
    if (degree >= 0 && degree <= 45) {
      return '북';
    } else if (degree > 45 && degree <= 90) {
      return '북동';
    } else if (degree > 90 && degree <= 135) {
      return '동';
    } else if (degree > 135 && degree <= 180) {
      return '동남';
    } else if (degree > 180 && degree <= 225) {
      return '남';
    } else if (degree > 225 && degree <= 270) {
      return '남서';
    } else if (degree > 270 && degree <= 315) {
      return '서';
    } else {
      return '북서';
    }
  };

  return (
    <DashboardContainer>
      <Header>
        {todayYear}.{todayMonth}.{todayDay} 날씨
      </Header>

      <WeatherBox>
        <Text>최고/최저 기온</Text>
        <BsThermometerSun className='weatherIcon' />
        <Text>{extractedData.TMX} / {extractedData.TMN}</Text>
      </WeatherBox>
      <WeatherBox>
        <Text>습도</Text>
        <BsFillDropletFill className='weatherIcon' />
        <Text>{extractedData.REH}%</Text>
      </WeatherBox>
      <WeatherBox>
        <Text>풍향</Text>
        <BsCloudFog2Fill className='weatherIcon' />
        <Text>{getDirection(parseFloat(extractedData.VEC))}풍</Text>
      </WeatherBox>
      <WeatherBox>
        <Text>풍속</Text>
        <BsThermometerSun className='weatherIcon' />
        <Text>{extractedData.WSD}m/s</Text>
      </WeatherBox>
      <WeatherBox>
        <Text>강수여부</Text>
        <BsFillDropletFill className='weatherIcon' />
        <Text>{extractedData.POP}%</Text>
      </WeatherBox>
    </DashboardContainer>
  );
};

export default Weather;
