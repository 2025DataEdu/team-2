
// 산책로 경로를 생성하는 함수 (실제 경로 좌표가 없을 때 가상 경로 생성)
export const generateWalkingPath = (centerLat: number, centerLng: number, distance: number, pathName: string): [number, number][] => {
  const coordinates: [number, number][] = [];
  const numPoints = Math.max(20, Math.floor(distance * 10)); // 거리에 따라 점의 개수 조정
  
  // 경로 유형에 따라 다른 패턴 생성
  if (pathName.includes('강변') || pathName.includes('하천')) {
    // 강변: 구불구불한 S자 형태
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5; // 대략적인 위도 변환
      
      const lat = centerLat + Math.sin(progress * Math.PI * 4) * offsetDistance * 0.3;
      const lng = centerLng + (progress - 0.5) * offsetDistance * 2;
      coordinates.push([lat, lng]);
    }
  } else if (pathName.includes('둘레') || pathName.includes('순환')) {
    // 둘레길: 원형 또는 타원형
    const radiusLat = (distance / 111) * 0.3;
    const radiusLng = radiusLat / Math.cos(centerLat * Math.PI / 180);
    
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const lat = centerLat + Math.cos(angle) * radiusLat;
      const lng = centerLng + Math.sin(angle) * radiusLng;
      coordinates.push([lat, lng]);
    }
  } else if (pathName.includes('산') || pathName.includes('등산')) {
    // 산길: 지그재그 형태
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5;
      
      const lat = centerLat + Math.sin(progress * Math.PI * 6) * offsetDistance * 0.2 + progress * offsetDistance;
      const lng = centerLng + Math.cos(progress * Math.PI * 8) * offsetDistance * 0.3;
      coordinates.push([lat, lng]);
    }
  } else {
    // 일반 직선형 경로 (약간의 곡선 추가)
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5;
      
      const lat = centerLat + Math.sin(progress * Math.PI * 2) * offsetDistance * 0.1;
      const lng = centerLng + (progress - 0.5) * offsetDistance * 1.5;
      coordinates.push([lat, lng]);
    }
  }
  
  return coordinates;
};
