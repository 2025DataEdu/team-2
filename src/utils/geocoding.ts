
// 주소를 위도/경도로 변환하는 함수
export const geocodeAddress = async (address: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
} | null> => {
  try {
    // Nominatim OpenStreetMap API 사용 (무료)
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('지오코딩 요청이 실패했습니다.');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('지오코딩 오류:', error);
    return null;
  }
};
