
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          🤖 AI가 분석 중입니다...
        </h2>
        <p className="font-body text-gray-600">
          위치 정보와 건강 데이터를 바탕으로 맞춤형 산책로를 준비하고 있습니다.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
