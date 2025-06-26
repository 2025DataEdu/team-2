
export const transformToChildlikeText = (text: string) => {
  // 5살 여자아이 말투로 변환 - 더더더 귀엽고 애기같게
  let childText = text
    // 기본 존댓말을 더 애기같은 반말로
    .replace(/안녕하세요/g, '안녕! 안녕! 나랑 놀자~')
    .replace(/추천해드려요/g, '추천해줄게! 완전 좋아!')
    .replace(/확인하실 수 있어요/g, '확인해봐봐~')
    .replace(/산책하세요/g, '산책해! 같이 가자!')
    .replace(/드릴게요/g, '줄게줄게!')
    .replace(/해주세요/g, '해줘해줘~')
    
    // 딱딱한 표현을 더 애기같게
    .replace(/소요시간은/g, '걸리는 시간은')
    .replace(/칼로리입니다/g, '칼로리야! 우와!')
    .replace(/편의시설로는/g, '편의시설은')
    .replace(/맛집으로는/g, '맛집은')
    .replace(/선택된/g, '골라진')
    .replace(/산책로:/g, '산책길!')
    .replace(/이유:/g, '왜냐하면~')
    .replace(/거리는/g, '길이는')
    .replace(/예상/g, '아마아마')
    .replace(/주변/g, '근처')
    .replace(/있습니다/g, '있어있어!')
    .replace(/추천합니다/g, '추천해! 완전 좋아!')
    
    // 어미 변환 - 더더더 귀엽게
    .replace(/습니다/g, '어어~')
    .replace(/입니다/g, '야야!')
    .replace(/해요/g, '해!')
    .replace(/이에요/g, '이야이야~')
    .replace(/예요/g, '야야!')
    .replace(/니다/g, '어어!');

  // 5살 아이다운 감탄사와 리듬감 추가
  const exclamations = ['우와우와~', '헤헤헷!', '완전짱!', '오홍홍~', '야호야호~', '킄킄킄~'];
  const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
  
  // 문장 시작에 감탄사 추가 (더 자주)
  if (Math.random() > 0.5 && !childText.includes('안녕')) {
    childText = randomExclamation + ' ' + childText;
  }
  
  // 문장 끝에 더 귀여운 표현 추가
  if (!childText.includes('헤헤헷') && !childText.includes('히히')) {
    const endings = ['헤헤헷~', '히히히~', '호호호~', '킄킄킄~', '야호~'];
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];
    if (Math.random() > 0.4) {
      childText = childText + ' ' + randomEnding;
    }
  }

  // 중요한 부분 더 귀엽게 강조
  childText = childText
    .replace(/([0-9]+)킬로미터/g, '$1킬로미터나! 완전 멀어!')
    .replace(/([0-9]+)분/g, '$1분이면 돼! 빨리빨리!')
    .replace(/([0-9]+)칼로리/g, '$1칼로리나 빠져! 우와 대박!');

  // 문장에 더 자연스러운 5살 아이 표현 추가
  childText = childText
    .replace(/근처/g, '근처에는~ ')
    .replace(/맛집은/g, '맛집은~ 완전 맛있어!')
    .replace(/편의시설은/g, '편의시설은~ ')
    .replace(/왜냐하면~/g, '왜냐하면~ ');

  return childText;
};
