
-- 건강정보 테이블에 주당 운동 시간 컬럼 추가
ALTER TABLE public.건강정보 
ADD COLUMN "주당 운동 시간(시간)" double precision;

-- 기존 데이터에 샘플 운동 시간 데이터 추가 (선택사항)
UPDATE public.건강정보 
SET "주당 운동 시간(시간)" = 
  CASE 
    WHEN "운동 빈도(회/주)" = '0' THEN 0
    WHEN "운동 빈도(회/주)" = '1-2' THEN 2.5
    WHEN "운동 빈도(회/주)" = '3-4' THEN 4.5
    WHEN "운동 빈도(회/주)" = '5-6' THEN 6.5
    WHEN "운동 빈도(회/주)" = '7' THEN 8
    WHEN "운동 빈도(회/주)" LIKE '%주%' THEN 3.5
    ELSE RANDOM() * 5 + 1  -- 1-6시간 사이의 랜덤값
  END
WHERE "주당 운동 시간(시간)" IS NULL;
