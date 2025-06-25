
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed } from 'lucide-react';

interface VirtualNearbyFoodProps {
  pathLocation?: string | null;
  pathName?: string | null;
}

const VirtualNearbyFood = ({ pathLocation, pathName }: VirtualNearbyFoodProps) => {
  // 지역별 가상 맛집 데이터
  const getVirtualFoodByLocation = (location: string | null, name: string | null) => {
    const foods: { [key: string]: string[] } = {
      '강남구': ['압구정 로데오 카페', '청담 디저트하우스', '신사동 가로수길 브런치'],
      '서초구': ['반포 한강 피크닉 카페', '교대 전통 찻집', '서초 맛집거리'],
      '마포구': ['홍대 치킨 명가', '합정 카페거리', '상수동 브런치 카페'],
      '종로구': ['인사동 전통차 카페', '삼청동 디저트', '북촌 한옥 찻집'],
      '중구': ['명동 만두집', '을지로 커피 로스터리', '동대문 야시장'],
      '용산구': ['이태원 세계음식거리', '한남동 브런치 카페', '경리단길 맛집'],
      '영등포구': ['여의도 한강 카페', '당산 맛집거리', '문래동 카페촌'],
      '송파구': ['잠실 롯데월드 맛집', '석촌호수 카페', '방이동 맛집거리'],
      '강동구': ['천호동 맛집', '암사동 카페', '고덕동 브런치'],
      '강북구': ['수유리 맛집', '미아동 전통시장', '번동 카페거리'],
      '성북구': ['성신여대 맛집거리', '안암동 대학가', '정릉동 카페'],
      '동대문구': ['청량리 맛집', '이문동 카페', '회기동 대학가'],
      '중랑구': ['망우동 맛집', '상봉동 카페', '중화동 전통시장'],
      '성동구': ['왕십리 맛집거리', '성수동 카페촌', '금호동 한강 카페'],
      '광진구': ['건대입구 맛집거리', '구의동 카페', '자양동 한강 피크닉'],
      '동작구': ['노량진 수산시장', '사당동 맛집', '흑석동 대학가'],
      '관악구': ['신림동 대학가', '봉천동 맛집', '서울대입구 카페'],
      '서대문구': ['신촌 대학가', '홍제동 맛집', '연희동 카페거리'],
      '은평구': ['연신내 맛집거리', '불광동 전통시장', '응암동 카페'],
      '노원구': ['상계동 맛집', '중계동 카페', '하계동 브런치'],
      '도봉구': ['도봉산 맛집', '쌍문동 전통시장', '창동 카페'],
      '강서구': ['화곡동 맛집', '발산동 카페', '마곡동 브런치'],
      '양천구': ['목동 맛집거리', '신정동 카페', '신월동 전통시장'],
      '구로구': ['구로디지털단지 맛집', '신도림 맛집거리', '개봉동 카페'],
      '금천구': ['가산디지털단지 맛집', '시흥동 카페', '독산동 브런치']
    };

    // 기본 맛집 (지역을 찾을 수 없는 경우)
    const defaultFoods = ['동네 맛집', '카페 거리', '전통 찻집'];

    // 지역명에서 구 이름 추출
    if (location) {
      for (const [district, restaurantList] of Object.entries(foods)) {
        if (location.includes(district)) {
          return restaurantList;
        }
      }
    }

    // 산책로 이름에서 지역 추정
    if (name) {
      const nameKeywords = {
        '한강': ['한강 치킨&맥주', '한강 피크닉 카페', '강변 브런치'],
        '남산': ['남산골 한옥마을 찻집', '케이크하우스', '전통 팥빙수'],
        '청계천': ['청계천 떡볶이', '호떡가게', '브런치카페'],
        '올림픽공원': ['올림픽공원 카페', '방이동 맛집', '석촌호수 디저트'],
        '선유도': ['선유도 카페', '양화한강공원 맛집', '당산 브런치'],
        '여의도': ['여의도 한강 카페', '국회의사당 맛집', 'IFC몰 디저트']
      };

      for (const [keyword, restaurantList] of Object.entries(nameKeywords)) {
        if (name.includes(keyword)) {
          return restaurantList;
        }
      }
    }

    return defaultFoods;
  };

  const virtualFoods = getVirtualFoodByLocation(pathLocation, pathName);

  return (
    <div>
      <div className="flex items-center gap-2 font-medium text-gray-900 mb-3">
        <UtensilsCrossed className="h-5 w-5 text-orange-600" />
        근처 맛집 & 디저트
      </div>
      <div className="flex gap-2 flex-wrap">
        {virtualFoods.map((food, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-sm bg-orange-50 text-orange-700 border-orange-200"
          >
            {food}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default VirtualNearbyFood;
