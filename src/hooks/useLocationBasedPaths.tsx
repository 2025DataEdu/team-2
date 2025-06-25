
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CoursDetailLength: number | null;
  CoursLength: string | null;
  CoursTime: string | null;
  CoursLv: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
  Address: string | null;
  CorusDetailName: string | null;
  CoursRoute: string | null;
}

interface LocationBasedPathsProps {
  userLatitude: number;
  userLongitude: number;
  maxDistance: number; // km
  limit: number;
}

// 두 지점 간의 거리를 계산하는 함수 (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export const useLocationBasedPaths = ({ userLatitude, userLongitude, maxDistance, limit }: LocationBasedPathsProps) => {
  const [allPaths, setAllPaths] = useState<RealWalkingPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('내주변산책로')
          .select('*')
          .not('Latitude', 'is', null)
          .not('Longitude', 'is', null);

        if (error) {
          throw error;
        }

        setAllPaths(data || []);
      } catch (err) {
        console.error('Error fetching walking paths:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // 위치 기반으로 필터링하고 정렬된 산책로
  const nearbyPaths = useMemo(() => {
    if (!allPaths.length || !userLatitude || !userLongitude) return [];

    const pathsWithDistance = allPaths.map(path => {
      if (!path.Latitude || !path.Longitude) return null;
      
      const distance = calculateDistance(
        userLatitude, 
        userLongitude, 
        path.Latitude, 
        path.Longitude
      );

      return {
        ...path,
        distance: Number(distance.toFixed(2))
      };
    }).filter((path): path is RealWalkingPath & { distance: number } => 
      path !== null && path.distance <= maxDistance
    );

    // 거리순으로 정렬하고 정확히 limit개만 반환
    const sortedPaths = pathsWithDistance.sort((a, b) => a.distance - b.distance);
    return sortedPaths.slice(0, limit);
  }, [allPaths, userLatitude, userLongitude, maxDistance, limit]);

  return { nearbyPaths, isLoading, error };
};
