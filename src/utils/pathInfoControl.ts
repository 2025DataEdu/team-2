
import L from 'leaflet';

interface WalkingPathInfo {
  name: string;
  distance: number;
}

// 경로 정보 표시를 위한 커스텀 컨트롤
export const createPathInfoControl = (walkingPath: WalkingPathInfo) => {
  const PathInfoControl = L.Control.extend({
    onAdd: function() {
      const div = L.DomUtil.create('div', 'path-info');
      div.innerHTML = `
        <div style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); font-size: 12px;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">🚶‍♂️ ${walkingPath.name}</div>
          <div style="color: #6b7280;">📏 ${walkingPath.distance.toFixed(1)}km</div>
          <div style="color: #3b82f6; margin-top: 4px;">--- 예상 경로</div>
        </div>
      `;
      return div;
    }
  });

  return new PathInfoControl({ position: 'topright' });
};
