import { AlertCircle, Loader2 } from 'lucide-react';

export function TrafficLoading() {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      <span className="ml-2 text-gray-500">트래픽 데이터 로딩 중...</span>
    </div>
  );
}

export function TrafficError({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-[400px] bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
      <div>
        <p className="text-red-700 font-medium">데이터 로딩 실패</p>
        <p className="text-red-600 text-sm">
          {message || '트래픽 데이터를 불러올 수 없습니다.'}
        </p>
      </div>
    </div>
  );
}

export function TrafficEmpty() {
  return (
    <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-500">표시할 트래픽 데이터가 없습니다.</p>
    </div>
  );
}
