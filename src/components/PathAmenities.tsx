
import React from 'react';

interface PathAmenitiesProps {
  amenities: string[];
  nearbyFood: string[];
}

const PathAmenities = ({ amenities, nearbyFood }: PathAmenitiesProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">주변 편의시설</h4>
      <div className="flex gap-2 flex-wrap mb-4">
        {amenities.map((amenity, index) => (
          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            {amenity}
          </span>
        ))}
      </div>
      
      <h4 className="font-semibold mb-2">🍰 근처 맛집 & 디저트</h4>
      <div className="flex gap-2 flex-wrap">
        {nearbyFood.map((food, index) => (
          <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
            {food}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PathAmenities;
