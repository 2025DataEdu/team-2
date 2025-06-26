// 의학적 근거에 기반한 운동강도 추천 유틸리티
// 참고: ACSM Guidelines, Korean Society of Cardiology, Korean Diabetes Association

export interface ExerciseRecommendation {
  intensity: 'low' | 'moderate' | 'high';
  intensityKr: string;
  heartRateRange: { min: number; max: number };
  duration: { min: number; max: number };
  frequency: string;
  precautions: string[];
  reasoning: string;
  medicalBasis: string;
}

export interface WalkingSpeed {
  walkingSpeed: string;
  joggingSpeed: string;
  heartRateRange: { min: number; max: number };
  intensityKr: string;
  recommendedPace: string;
}

interface HealthProfile {
  나이: number | null;
  '수축기 혈압': number | null;
  '이완기 혈압': number | null;
  '혈당(mg/dL)': number | null;
  '총콜레스테롤(mg/dL)': number | null;
  '진단 질병': string | null;
  '운동 빈도(회/주)': string | null;
  '흡연 여부': string | null;
}

export const getExerciseRecommendation = (healthProfile: HealthProfile): ExerciseRecommendation => {
  const age = healthProfile.나이 || 40;
  const systolicBP = healthProfile['수축기 혈압'] || 120;
  const diastolicBP = healthProfile['이완기 혈압'] || 80;
  const bloodGlucose = healthProfile['혈당(mg/dL)'] || 100;
  const cholesterol = healthProfile['총콜레스테롤(mg/dL)'] || 200;
  const diagnosis = healthProfile['진단 질병'] || '';
  const currentExercise = healthProfile['운동 빈도(회/주)'] || '0';
  const smoking = healthProfile['흡연 여부'] || 'N';

  // 최대심박수 계산 (220 - 나이)
  const maxHeartRate = 220 - age;
  
  // 고위험 요인 평가
  const hasHypertension = systolicBP >= 140 || diastolicBP >= 90;
  const hasDiabetes = bloodGlucose >= 126 || diagnosis.includes('당뇨');
  const hasHeartDisease = diagnosis.includes('심장') || diagnosis.includes('협심증') || diagnosis.includes('심근경색');
  const hasChronicDisease = diagnosis.includes('고혈압') || diagnosis.includes('신장') || diagnosis.includes('간');
  const isOverweight = diagnosis.includes('비만');
  const isSmoker = smoking === 'Y' || smoking === '예';
  const isHighCholesterol = cholesterol >= 240;
  const isInactive = currentExercise === '0' || currentExercise.includes('없음');

  let recommendation: ExerciseRecommendation;

  // 심혈관 질환이나 고위험 상태인 경우
  if (hasHeartDisease || (hasHypertension && hasDiabetes)) {
    recommendation = {
      intensity: 'low',
      intensityKr: '저강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.4), 
        max: Math.round(maxHeartRate * 0.6) 
      },
      duration: { min: 20, max: 30 },
      frequency: '주 3-4회',
      precautions: [
        '운동 전후 혈압 체크 필수',
        '가슴 통증, 어지러움 시 즉시 중단',
        '의사와 상담 후 운동 시작',
        '충분한 워밍업과 쿨다운'
      ],
      reasoning: '심혈관 질환이나 고혈압+당뇨 동반 시 급격한 운동은 위험할 수 있어 저강도 운동으로 시작하여 점진적으로 증가시켜야 합니다.',
      medicalBasis: '대한심장학회 권고안: 심혈관 질환자는 최대심박수의 40-60% 강도로 시작 (Korean Circulation Journal, 2019)'
    };
  }
  // 당뇨병이 있는 경우
  else if (hasDiabetes) {
    recommendation = {
      intensity: 'moderate',
      intensityKr: '중강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.5), 
        max: Math.round(maxHeartRate * 0.7) 
      },
      duration: { min: 30, max: 45 },
      frequency: '주 5회 이상',
      precautions: [
        '운동 전후 혈당 체크',
        '저혈당 증상 주의 (어지러움, 식은땀)',
        '충분한 수분 섭취',
        '발 관리 주의 (적절한 신발 착용)'
      ],
      reasoning: '당뇨병 환자는 규칙적인 중강도 운동으로 혈당 조절과 인슐린 감수성을 개선할 수 있습니다. 매일 운동이 혈당 관리에 도움이 됩니다.',
      medicalBasis: '대한당뇨병학회: 당뇨병 환자는 주 150분 이상 중강도 운동 권장 (Diabetes & Metabolism Journal, 2021)'
    };
  }
  // 고혈압이 있는 경우
  else if (hasHypertension) {
    recommendation = {
      intensity: 'moderate',
      intensityKr: '중강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.5), 
        max: Math.round(maxHeartRate * 0.7) 
      },
      duration: { min: 30, max: 45 },
      frequency: '주 4-5회',
      precautions: [
        '운동 전후 혈압 측정',
        '수축기 혈압 180mmHg 이상 시 운동 금지',
        '무산소 운동(웨이트) 제한',
        '충분한 수분 섭취'
      ],
      reasoning: '고혈압 환자는 규칙적인 유산소 운동으로 혈압을 5-10mmHg 정도 낮출 수 있습니다. 과격한 운동보다는 꾸준한 중강도 운동이 효과적입니다.',
      medicalBasis: 'ACSM 가이드라인: 고혈압 환자는 주 150분 중강도 운동으로 혈압 감소 효과 (Hypertension, 2021)'
    };
  }
  // 고령자 (65세 이상)이면서 운동 경험이 적은 경우
  else if (age >= 65 && isInactive) {
    recommendation = {
      intensity: 'low',
      intensityKr: '저강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.4), 
        max: Math.round(maxHeartRate * 0.6) 
      },
      duration: { min: 20, max: 40 },
      frequency: '주 3-4회',
      precautions: [
        '낙상 위험 주의',
        '관절 통증 시 운동 강도 조절',
        '충분한 휴식과 회복 시간',
        '균형감각 운동 병행'
      ],
      reasoning: '고령자는 근력과 균형감각이 감소하므로 안전한 저강도 운동부터 시작하여 점진적으로 강도를 높여야 합니다.',
      medicalBasis: '대한노인의학회: 65세 이상은 점진적 운동 시작으로 낙상 예방 (Annals of Geriatric Medicine, 2020)'
    };
  }
  // 흡연자이거나 고콜레스테롤인 경우
  else if (isSmoker || isHighCholesterol || hasChronicDisease) {
    recommendation = {
      intensity: 'moderate',
      intensityKr: '중강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.5), 
        max: Math.round(maxHeartRate * 0.7) 
      },
      duration: { min: 25, max: 40 },
      frequency: '주 4-5회',
      precautions: [
        '운동 중 호흡곤란 주의',
        '가슴 답답함 시 즉시 중단',
        '금연과 함께 운동 병행',
        '콜레스테롤 수치 정기 체크'
      ],
      reasoning: '흡연이나 고콜레스테롤은 심혈관 위험을 증가시키므로 적절한 운동으로 심폐기능을 개선하고 혈중 지질을 개선해야 합니다.',
      medicalBasis: '대한심장학회: 심혈관 위험인자 보유 시 중강도 운동으로 위험도 감소 (Korean Circulation Journal, 2020)'
    };
  }
  // 운동 경험이 거의 없는 경우
  else if (isInactive) {
    recommendation = {
      intensity: 'low',
      intensityKr: '저강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.4), 
        max: Math.round(maxHeartRate * 0.6) 
      },
      duration: { min: 15, max: 30 },
      frequency: '주 3회',
      precautions: [
        '운동 강도를 점진적으로 증가',
        '근육통이 심하면 하루 휴식',
        '충분한 수분 섭취',
        '올바른 운동 자세 학습'
      ],
      reasoning: '운동 경험이 없는 분은 갑작스러운 고강도 운동으로 인한 부상 위험이 있으므로 저강도부터 시작하여 체력을 점진적으로 향상시켜야 합니다.',
      medicalBasis: 'ACSM 초심자 가이드라인: 운동 미경험자는 저강도 15-30분부터 시작 (ACSM Guidelines, 2022)'
    };
  }
  // 건강한 성인
  else {
    recommendation = {
      intensity: 'moderate',
      intensityKr: '중강도',
      heartRateRange: { 
        min: Math.round(maxHeartRate * 0.6), 
        max: Math.round(maxHeartRate * 0.8) 
      },
      duration: { min: 30, max: 60 },
      frequency: '주 5회',
      precautions: [
        '운동 전 충분한 워밍업',
        '탈수 방지를 위한 수분 섭취',
        '운동 후 적절한 휴식',
        '몸의 변화 주의 깊게 관찰'
      ],
      reasoning: '건강한 성인은 심폐지구력 향상과 건강 유지를 위해 WHO에서 권장하는 주 150분의 중강도 운동이 적합합니다.',
      medicalBasis: 'WHO 권고안: 건강한 성인은 주 150분 중강도 또는 75분 고강도 운동 (WHO Physical Activity Guidelines, 2020)'
    };
  }

  return recommendation;
};

// 걷기/조깅 속도 계산 함수
export const getWalkingSpeed = (healthProfile: HealthProfile, exerciseRecommendation?: ExerciseRecommendation | null): WalkingSpeed => {
  const age = healthProfile.나이 || 40;
  const diagnosis = healthProfile['진단 질병'] || '';
  
  // 기본 추천 가져오기
  const recommendation = exerciseRecommendation || getExerciseRecommendation(healthProfile);
  
  let walkingSpeed: string;
  let joggingSpeed: string;
  let recommendedPace: string;

  // 운동강도별 속도 설정
  switch (recommendation.intensity) {
    case 'low':
      walkingSpeed = '3.5-4.5 km/h';
      joggingSpeed = '5.0-6.0 km/h';
      recommendedPace = '천천히 걷기 위주';
      break;
    case 'moderate':
      walkingSpeed = '4.5-6.0 km/h';
      joggingSpeed = '6.0-8.0 km/h';
      recommendedPace = '빠른 걷기 + 가벼운 조깅';
      break;
    case 'high':
      walkingSpeed = '5.5-7.0 km/h';
      joggingSpeed = '7.0-10.0 km/h';
      recommendedPace = '조깅 위주 + 일부 달리기';
      break;
    default:
      walkingSpeed = '4.0-5.0 km/h';
      joggingSpeed = '6.0-7.0 km/h';
      recommendedPace = '보통 속도 걷기';
  }

  // 특수 상황 조정
  if (age >= 65) {
    walkingSpeed = '3.0-4.0 km/h';
    joggingSpeed = '4.5-5.5 km/h';
    recommendedPace = '안전한 속도로 천천히';
  }

  if (diagnosis.includes('무릎') || diagnosis.includes('관절')) {
    walkingSpeed = '3.0-4.5 km/h';
    joggingSpeed = '5.0-6.5 km/h';
    recommendedPace = '관절에 무리가 가지 않는 속도';
  }

  return {
    walkingSpeed,
    joggingSpeed,
    heartRateRange: recommendation.heartRateRange,
    intensityKr: recommendation.intensityKr,
    recommendedPace
  };
};

// 운동강도별 색상 반환
export const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
