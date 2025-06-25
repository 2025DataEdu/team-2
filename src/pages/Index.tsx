
import React from 'react';
import ProblemDefinitionForm from '@/components/ProblemDefinitionForm';
import VoiceInterface from '@/components/VoiceInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            문제정의 템플릿 도구
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            체계적인 문제 분석과 해결책 도출을 위한 템플릿입니다. 
            음성으로도 입력하고 안내를 받을 수 있습니다.
          </p>
        </div>
        
        <ProblemDefinitionForm />
        <VoiceInterface />
      </div>
    </div>
  );
};

export default Index;
