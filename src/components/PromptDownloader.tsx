
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database, Loader2, FileArchive } from 'lucide-react';
import { promptContent } from '@/utils/promptContent';
import { downloadPrompt } from '@/utils/csvExporter';
import { useSupabaseExport } from '@/hooks/useSupabaseExport';
import { useSourceCodeDownload } from '@/hooks/useSourceCodeDownload';

const PromptDownloader = () => {
  const { exportSupabaseTables, isExporting } = useSupabaseExport();
  const { downloadSourceCode, isDownloadingSource } = useSourceCodeDownload();

  const handleDownloadPrompt = () => {
    downloadPrompt(promptContent);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📝 AI 프롬프트 다운로드 (v3 - Supabase 스키마 포함)
          </h3>
          <p className="text-gray-600 text-sm">
            현재 앱의 모든 기능과 구조, 그리고 Supabase 데이터베이스 테이블 스키마까지 포함한 완전한 AI 프롬프트를 다운로드하거나 CSV 파일로 데이터를 익스포트하고, 소스코드를 압축해서 다운로드할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleDownloadPrompt}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            프롬프트 다운로드
          </Button>
          <Button 
            onClick={exportSupabaseTables}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isExporting ? '익스포트 중...' : 'CSV 익스포트'}
          </Button>
          <Button 
            onClick={downloadSourceCode}
            disabled={isDownloadingSource}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isDownloadingSource ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileArchive className="h-4 w-4" />
            )}
            {isDownloadingSource ? '압축 중...' : '소스코드 다운로드'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptDownloader;
