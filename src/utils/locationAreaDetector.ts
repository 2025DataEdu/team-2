
import { UserLocation } from '@/types/walkingPath';

export const getLocationArea = (location?: UserLocation): string => {
  if (!location) return 'default';
  
  const { latitude, longitude, address } = location;
  const addressLower = address.toLowerCase();
  
  console.log('지역 판단 중:', { latitude, longitude, address, addressLower });
  
  // 주소 기반 지역 판단 - 더 정확한 키워드 매칭
  if (addressLower.includes('강남') || addressLower.includes('gangnam')) {
    console.log('강남 지역으로 판단됨');
    return 'gangnam';
  }
  if (addressLower.includes('홍대') || addressLower.includes('hongdae') || addressLower.includes('마포')) {
    console.log('홍대/마포 지역으로 판단됨');
    return 'hongdae';
  }
  if (addressLower.includes('명동') || addressLower.includes('myeongdong') || addressLower.includes('중구')) {
    console.log('명동/중구 지역으로 판단됨');
    return 'myeongdong';
  }
  if (addressLower.includes('이태원') || addressLower.includes('itaewon')) {
    console.log('이태원 지역으로 판단됨');
    return 'itaewon';
  }
  if (addressLower.includes('서초') || addressLower.includes('seocho')) {
    console.log('서초 지역으로 판단됨');
    return 'seocho';
  }
  if (addressLower.includes('종로') || addressLower.includes('jongno')) {
    console.log('종로 지역으로 판단됨');
    return 'jongno';
  }
  if (addressLower.includes('유성') || addressLower.includes('대전')) {
    console.log('대전 지역으로 판단됨');
    return 'daejeon';
  }
  if (addressLower.includes('부산')) {
    console.log('부산 지역으로 판단됨');
    return 'busan';
  }
  if (addressLower.includes('대구')) {
    console.log('대구 지역으로 판단됨');
    return 'daegu';
  }
  if (addressLower.includes('인천')) {
    console.log('인천 지역으로 판단됨');
    return 'incheon';
  }
  
  // 좌표 기반 지역 판단
  if (latitude >= 36.0 && latitude <= 36.7 && longitude >= 127.0 && longitude <= 127.7) {
    console.log('좌표 기반 대전 지역으로 판단됨');
    return 'daejeon';
  }
  if (latitude >= 37.5 && latitude <= 37.6 && longitude >= 126.9 && longitude <= 127.1) {
    if (latitude > 37.55) {
      console.log('좌표 기반 서울 북부로 판단됨');
      return 'north_seoul';
    }
    console.log('좌표 기반 서울 남부로 판단됨'); 
    return 'south_seoul';
  }
  
  console.log('기본 지역으로 판단됨');
  return 'default';
};
