
export const convertToCSV = (data: any[], headers: string[]) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // CSV에서 쉼표와 따옴표를 처리
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const BOM = '\uFEFF'; // UTF-8 BOM for proper Korean character display
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadPrompt = (promptContent: string) => {
  const blob = new Blob([promptContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'AI_건강_산책로_추천앱_프롬프트_v3_with_supabase.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
