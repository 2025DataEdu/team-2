
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MiniMapProps {
  latitude?: number;
  longitude?: number;
  pathName?: string;
  className?: string;
}

const MiniMap = ({ latitude, longitude, pathName, className = "w-full h-32" }: MiniMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = React.useState('');
  const [showApiKeyInput, setShowApiKeyInput] = React.useState(false);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    // 임시 API 키가 있는지 확인
    const storedApiKey = localStorage.getItem('mapbox-api-key');
    if (!storedApiKey && !apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const currentApiKey = apiKey || storedApiKey;
    if (!currentApiKey || currentApiKey.trim() === '') {
      setShowApiKeyInput(true);
      return;
    }

    try {
      mapboxgl.accessToken = currentApiKey;
      
      // 기존 지도가 있으면 제거
      if (map.current) {
        map.current.remove();
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [longitude, latitude],
        zoom: 14,
        interactive: false // 작은 지도는 상호작용 비활성화
      });

      // 마커 추가
      new mapboxgl.Marker({ color: '#16a34a' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${pathName || '산책로 위치'}</h3>`))
        .addTo(map.current);

    } catch (error) {
      console.error('Mapbox 지도 로드 오류:', error);
      setShowApiKeyInput(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, pathName, apiKey]);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('mapbox-api-key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg p-4 flex flex-col justify-center items-center`}>
        <div className="text-center space-y-3 w-full">
          <p className="text-sm text-gray-600">지도를 표시하려면 Mapbox API 키가 필요합니다</p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-api-key" className="text-xs">Mapbox Public Token</Label>
            <Input
              id="mapbox-api-key"
              type="text"
              placeholder="pk.eyJ1..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <button
            onClick={handleApiKeySubmit}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
          >
            설정
          </button>
          <p className="text-xs text-gray-500">
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              mapbox.com
            </a>에서 무료 토큰을 받을 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center`}>
        <p className="text-sm text-gray-500">위치 정보 없음</p>
      </div>
    );
  }

  return <div ref={mapContainer} className={`${className} rounded-lg border border-gray-200`} />;
};

export default MiniMap;
