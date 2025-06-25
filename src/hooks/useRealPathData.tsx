
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CorusDetailName: string | null;
  Address: string | null;
  CoursLength: string | null;
  CoursDetailLength: number | null;
  CoursTime: string | null;
  CoursLv: string | null;
  CoursRoute: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
}

export const useRealPathData = () => {
  const [paths, setPaths] = useState<RealWalkingPath[]>([]);
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
          .not('Longitude', 'is', null)
          .limit(50); // 처음에는 50개만 로드

        if (error) {
          throw error;
        }

        setPaths(data || []);
      } catch (err) {
        console.error('Error fetching walking paths:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaths();
  }, []);

  return { paths, isLoading, error };
};
