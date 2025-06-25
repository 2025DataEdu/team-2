
import React from 'react';

const AppHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        🚶‍♀️ AI 맞춤형 산책길 추천 서비스
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        개인의 건강 상태와 실시간 환경 정보를 분석하여 
        가장 적합한 산책로를 추천해드리는 스마트 서비스입니다.
      </p>
    </div>
  );
};

export default AppHeader;
