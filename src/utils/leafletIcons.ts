
import L from 'leaflet';

// Leaflet 기본 아이콘 설정 초기화
export const initializeLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// 시작점 아이콘 생성
export const createStartIcon = () => {
  return L.divIcon({
    html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: 'custom-start-marker'
  });
};

// 종료점 아이콘 생성
export const createEndIcon = () => {
  return L.divIcon({
    html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: 'custom-end-marker'
  });
};

// 방향 화살표 아이콘 생성
export const createArrowIcon = (bearing: number) => {
  return L.divIcon({
    html: `<div style="transform: rotate(${bearing + 90}deg); font-size: 16px;">➤</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'custom-arrow-marker'
  });
};
