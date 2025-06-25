
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WalkingPathData {
  CoursCode: string;
  CoursName: string | null;
  CoursLength: string | null;
  CoursDetailLength: number | null;
  CoursTime: string | null;
  CoursLv: string | null;
  CoursRoute: string | null;
  Address: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  CVNTL_NM: string | null;
  SIGNGU_NM: string | null;
  CorusDetailName: string | null;
}

export interface TraditionalMarketData {
  코드: string;
  시장명: string | null;
  시장유형: string | null;
  도로명주소: string | null;
  지번주소: string | null;
  시도: string | null;
  시군구: string | null;
  경위도X좌표: number | null;
  경위도Y좌표: number | null;
  아케이드보유여부: string | null;
  고객지원센터보유여부: string | null;
  스프링쿨러보유여부: string | null;
  화재감지기보유여부: string | null;
  시장전용고객주차장_보유여부: string | null;
  교육장_보유여부: string | null;
  회의실_보유여부: string | null;
}

export const useWalkingPaths = (userLocation?: { latitude: number; longitude: number }) => {
  const [walkingPaths, setWalkingPaths] = useState<WalkingPathData[]>([]);
  const [traditionalMarkets, setTraditionalMarkets] = useState<TraditionalMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalkingPaths = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: pathsData, error: pathsError } = await supabase
        .from('내주변산책로')
        .select('*')
        .not('Latitude', 'is', null)
        .not('Longitude', 'is', null)
        .limit(20);

      if (pathsError) throw pathsError;

      const { data: marketsData, error: marketsError } = await supabase
        .from('전통시장현황')
        .select('*')
        .not('경위도X좌표', 'is', null)
        .not('경위도Y좌표', 'is', null);

      if (marketsError) throw marketsError;

      setWalkingPaths(pathsData || []);
      setTraditionalMarkets(marketsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkingPaths();
  }, []);

  return {
    walkingPaths,
    traditionalMarkets,
    isLoading,
    error,
    refetch: fetchWalkingPaths
  };
};
