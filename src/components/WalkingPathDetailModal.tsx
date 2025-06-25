
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Route, Info, Building2 } from 'lucide-react';
import MiniMap from './MiniMap';
import { WalkingPathData, TraditionalMarketData } from '@/hooks/useWalkingPaths';

interface WalkingPathDetailModalProps {
  path: WalkingPathData | null;
  isOpen: boolean;
  onClose: () => void;
  nearbyMarkets: TraditionalMarketData[];
}

const WalkingPathDetailModal = ({ path, isOpen, onClose, nearbyMarkets }: WalkingPathDetailModalProps) => {
  if (!path) return null;

  const getDifficultyText = (level: string | null) => {
    if (!level) return '정보없음';
    if (level.includes('쉬') || level.includes('초급')) return '쉬움';
    if (level.includes('어려') || level.includes('고급')) return '어려움';
    return '보통';
  };

  const getDifficultyColor = (level: string | null) => {
    const difficulty = getDifficultyText(level);
    switch (difficulty) {
      case '쉬움': return 'bg-green-100 text-green-800';
      case '어려움': return 'bg-red-100 text-red-800';
      case '보통': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDistance = (length: string | number | null) => {
    if (!length) return '정보없음';
    if (typeof length === 'string') {
      const num = parseFloat(length);
      return isNaN(num) ? length : `${num}km`;
    }
    return `${length}km`;
  };

  const formatTime = (time: string | null) => {
    if (!time) return '정보없음';
    return time.includes('분') ? time : `${time}분`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Route className="h-5 w-5 text-green-600" />
            {path.CoursName || '산책로'}
          </DialogTitle>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge className={getDifficultyColor(path.CoursLv)}>
              {getDifficultyText(path.CoursLv)}
            </Badge>
            {path.CVNTL_NM && (
              <Badge variant="outline">
                {path.CVNTL_NM}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 지도 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              위치
            </h4>
            <MiniMap 
              latitude={path.Latitude || undefined} 
              longitude={path.Longitude || undefined} 
              pathName={path.CoursName || '산책로'}
              className="w-full h-48"
            />
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">기본 정보</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">거리:</span>
                    <span className="font-medium">{formatDistance(path.CoursLength || path.CoursDetailLength)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">소요시간:</span>
                    <span className="font-medium">{formatTime(path.CoursTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">난이도:</span>
                    <span className="font-medium">{getDifficultyText(path.CoursLv)}</span>
                  </div>
                </div>
              </div>

              {path.Address && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">주소</h4>
                  <p className="text-sm text-gray-600">{path.Address}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {path.CoursRoute && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">코스 경로</h4>
                  <p className="text-sm text-gray-600">{path.CoursRoute}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">편의시설</h4>
                <div className="flex gap-2 flex-wrap">
                  {path.Toilet === 'Y' && (
                    <Badge variant="secondary">화장실</Badge>
                  )}
                  {path.ADIT_DC && (
                    <Badge variant="secondary">{path.ADIT_DC}</Badge>
                  )}
                  {path.Option && (
                    <Badge variant="secondary">{path.Option}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 근처 전통시장 */}
          {nearbyMarkets.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-orange-600" />
                근처 전통시장
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {nearbyMarkets.slice(0, 4).map((market, index) => (
                  <div key={market.코드} className="p-3 border rounded-lg bg-orange-50">
                    <h5 className="font-medium text-orange-800">{market.시장명}</h5>
                    <p className="text-sm text-orange-700">{market.도로명주소 || market.지번주소}</p>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {market.아케이드보유여부 === 'Y' && (
                        <Badge variant="outline" className="text-xs">아케이드</Badge>
                      )}
                      {market.시장전용고객주차장_보유여부 === 'Y' && (
                        <Badge variant="outline" className="text-xs">주차장</Badge>
                      )}
                      {market.고객지원센터보유여부 === 'Y' && (
                        <Badge variant="outline" className="text-xs">고객센터</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {path.ADIT_DC && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-blue-800 mb-1">추가 정보</div>
                  <p className="text-sm text-blue-700">{path.ADIT_DC}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              className="flex-1"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkingPathDetailModal;
