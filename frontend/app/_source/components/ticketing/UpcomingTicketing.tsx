import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import TicketingData from "./TicketingData";

/**
 * Renders the upcoming ticketing section with built-in error and loading fallbacks.
 *
 * Displays a styled card containing `TicketingData`, wrapped in an `ErrorBoundary` (fallback: "추후 에러 표시 화면 구현")
 * and a `Suspense` boundary (fallback: "공연 정보를 불러오는 중입니다.").
 *
 * @returns A JSX element representing the upcoming ticketing section
 */
export default function UpcomingTicketing() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ErrorBoundary fallback={<div>추후 에러 표시 화면 구현</div>}>
            <Suspense fallback={<div>공연 정보를 불러오는 중입니다.</div>}>
              <TicketingData />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}