
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  latitude?: number;
  longitude?: number;
  pathName?: string;
  className?: string;
}

const MiniMap = ({ latitude, longitude, pathName, className = "w-full h-32" }: MiniMapProps) => {
  // Fix leaflet icon issue
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  if (!latitude || !longitude) {
    return (
      <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center`}>
        <p className="text-sm text-gray-500">위치 정보 없음</p>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg border border-gray-200 overflow-hidden`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{pathName || '산책로 위치'}</strong>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MiniMap;
