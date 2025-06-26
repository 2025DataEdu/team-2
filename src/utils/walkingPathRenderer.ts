
import L from 'leaflet';
import { generateWalkingPath } from './walkingPathGenerator';
import { createStartIcon, createEndIcon, createArrowIcon } from './leafletIcons';
import { createPathInfoControl } from './pathInfoControl';

interface WalkingPathData {
  name: string;
  distance: number;
  coordinates?: [number, number][];
}

export const renderWalkingPath = (
  map: L.Map, 
  latitude: number, 
  longitude: number, 
  walkingPath: WalkingPathData
) => {
  let pathCoordinates: [number, number][] = [];
  
  if (walkingPath.coordinates && walkingPath.coordinates.length > 0) {
    // 실제 좌표가 있는 경우
    pathCoordinates = walkingPath.coordinates;
  } else {
    // 실제 좌표가 없는 경우 가상 경로 생성
    pathCoordinates = generateWalkingPath(latitude, longitude, walkingPath.distance, walkingPath.name);
  }

  // 경로 라인 그리기
  const pathLine = L.polyline(pathCoordinates, {
    color: '#3b82f6',
    weight: 4,
    opacity: 0.8,
    smoothFactor: 1,
    dashArray: '10, 5'
  }).addTo(map);

  // 시작점 마커 추가
  const startIcon = createStartIcon();
  L.marker([latitude, longitude], { icon: startIcon }).addTo(map)
    .bindPopup('<div style="font-size: 12px; font-weight: bold; color: #059669;">🚶‍♂️ 출발점</div>');

  // 종료점 마커 추가
  if (pathCoordinates.length > 0) {
    const endPoint = pathCoordinates[pathCoordinates.length - 1];
    const endIcon = createEndIcon();
    L.marker(endPoint, { icon: endIcon }).addTo(map)
      .bindPopup('<div style="font-size: 12px; font-weight: bold; color: #dc2626;">🏁 도착점</div>');
  }

  // 경로 중간점들에 방향 화살표 추가
  for (let i = 1; i < pathCoordinates.length; i += Math.floor(pathCoordinates.length / 5)) {
    const prevPoint = pathCoordinates[i - 1];
    const currPoint = pathCoordinates[i];
    
    // 방향 계산
    const bearing = Math.atan2(
      currPoint[1] - prevPoint[1],
      currPoint[0] - prevPoint[0]
    ) * 180 / Math.PI;

    const arrowIcon = createArrowIcon(bearing);
    L.marker(currPoint, { icon: arrowIcon }).addTo(map);
  }

  // 경로 정보 컨트롤 추가
  const pathInfoControl = createPathInfoControl(walkingPath);
  pathInfoControl.addTo(map);

  // 전체 경로가 보이도록 맵 범위 조정
  try {
    const bounds = L.latLngBounds(pathCoordinates);
    map.fitBounds(bounds, { padding: [20, 20] });
  } catch (error) {
    // 경로 피팅에 실패하면 기본 줌 레벨 사용
    map.setView([latitude, longitude], 14);
  }
};
