
import { useState } from 'react';
import { createSourceCodePackage, downloadSourceCodeZip } from '@/utils/sourceCodePackager';

export const useSourceCodeDownload = () => {
  const [isDownloadingSource, setIsDownloadingSource] = useState(false);

  const downloadSourceCode = async () => {
    setIsDownloadingSource(true);
    try {
      const zip = await createSourceCodePackage();
      await downloadSourceCodeZip(zip);
      console.log('소스코드 압축 파일 다운로드 완료');
    } catch (error) {
      console.error('소스코드 다운로드 중 오류 발생:', error);
      alert('소스코드 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloadingSource(false);
    }
  };

  return {
    downloadSourceCode,
    isDownloadingSource
  };
};
