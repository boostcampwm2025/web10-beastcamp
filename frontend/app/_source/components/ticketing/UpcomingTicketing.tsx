import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import TicketingData from './TicketingData';

export default function UpcomingTicketing() {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <ErrorBoundary fallback={<div>추후 에러 표시 화면 구현</div>}>
          <Suspense fallback={<div>공연 정보를 불러오는 중입니다.</div>}>
            <TicketingData />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
