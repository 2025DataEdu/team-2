
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            새 프로젝트
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            여기서 새로운 아이디어를 시작해보세요
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        
        <div className="text-sm text-gray-500">
          준비가 완료되었습니다
        </div>
      </div>
    </div>
  );
};

export default Index;
