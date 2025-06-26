
export const getOptimalVoice = () => {
  const voices = speechSynthesis.getVoices();
  
  // 어린 여자아이 목소리에 가까운 순서대로 정렬
  const preferredVoices = [
    // 한국어 여성 목소리들 (높은 톤)
    'Microsoft Heami',
    'Microsoft SunHi', 
    'Google 한국의',
    'Yuna',
    // 일본어 여성 목소리들 (어린 느낌)
    'Kyoko',
    'Otoya',
    'Hattori',
    // 영어 여성 목소리들 중 어린 톤
    'Samantha',
    'Victoria',
    'Alice',
    'Princess',
    'Kathy',
    'Zoe',
    'Karen'
  ];

  // 우선순위에 따라 목소리 찾기
  for (const preferredName of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferredName) && 
      !v.name.toLowerCase().includes('male') &&
      !v.name.toLowerCase().includes('man')
    );
    if (voice) {
      console.log(`Selected voice: ${voice.name} (${voice.lang})`);
      return voice;
    }
  }

  // 여성 키워드가 포함된 목소리 찾기
  const femaleKeywords = ['female', 'woman', 'girl', '여성', '여자'];
  const femaleVoice = voices.find(v => 
    femaleKeywords.some(keyword => 
      v.name.toLowerCase().includes(keyword)
    ) && !v.name.toLowerCase().includes('male')
  );
  if (femaleVoice) {
    console.log(`Selected female voice: ${femaleVoice.name}`);
    return femaleVoice;
  }

  // 한국어 목소리 중 아무거나
  const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
  if (koreanVoice) {
    console.log(`Selected Korean voice: ${koreanVoice.name}`);
    return koreanVoice;
  }

  console.log(`Using default voice: ${voices[0]?.name || 'none'}`);
  return voices[0];
};
