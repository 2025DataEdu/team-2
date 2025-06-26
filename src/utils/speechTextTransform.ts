
export const transformToChildlikeText = (text: string) => {
  // 진짜 5살 여자아이 말투로 변환 - 더더더 귀엽고 짧게
  let childText = text
    // 기본 존댓말을 5살 아이 반말로
    .replace(/안녕하세요/g, '안녕~ 안녕!')
    .replace(/추천해드려요/g, '추천해줄게!')
    .replace(/확인하실 수 있어요/g, '확인해봐~')
    .replace(/산책하세요/g, '산책해! 같이 가자!')
    .replace(/드릴게요/g, '줄게!')
    .replace(/해주세요/g, '해줘~')
    
    // 딱딱한 표현을 5살 아이답게
    .replace(/소요시간은/g, '걸리는 시간은')
    .replace(/칼로리입니다/g, '칼로리쪄!')
    .replace(/편의시설로는/g, '편의시설은~')
    .replace(/맛집으로는/g, '맛집은~')
    .replace(/선택된/g, '골라진')
    .replace(/산책로:/g, '산책길!')
    .replace(/이유:/g, '왜냐하면~')
    .replace(/거리는/g, '길이는')
    .replace(/예상/g, '아마아마')
    .replace(/주변/g, '근처')
    .replace(/있습니다/g, '있어!')
    .replace(/추천합니다/g, '추천해!')
    
    // 어미 변환 - 진짜 5살처럼
    .replace(/습니다/g, '어!')
    .replace(/입니다/g, '쪄!')
    .replace(/해요/g, '해!')
    .replace(/이에요/g, '이야~')
    .replace(/예요/g, '야!')
    .replace(/니다/g, '어!');

  // 5살 아이 감탄사들
  const exclamations = ['우와~', '헤헷!', '짠!', '야호~', '어머!', '와!'];
  const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
  
  // 문장 시작에 감탄사 (자주)
  if (Math.random() > 0.3) {
    childText = randomExclamation + ' ' + childText;
  }
  
  // 5살 아이 문장 끝맺음
  const endings = ['~지?', '~해줄게!', '~쪄!', '~이야~', '~라구!', '알았쪄~'];
  const randomEnding = endings[Math.floor(Math.random() * endings.length)];
  
  // 기존 끝맺음이 없으면 추가
  if (!childText.match(/[!~?]$/)) {
    childText = childText + ' ' + randomEnding;
  }

  // 숫자 표현도 귀엽게
  childText = childText
    .replace(/([0-9]+)킬로미터/g, '$1킬로미터나!')
    .replace(/([0-9]+)분/g, '$1분이면 돼!')
    .replace(/([0-9]+)칼로리/g, '$1칼로리나!');

  // 문장을 더 짧고 간단하게 나누기
  childText = childText
    .replace(/그리고/g, '그리고~')
    .replace(/또한/g, '또~')
    .replace(/하지만/g, '근데~')
    .replace(/때문에/g, '라서~');

  return childText;
};
