import TicketResult from "./_source/components/TicketResult";
import { ResultProvider } from "./_source/contexts/ResultProvider";

interface TicketResultPageProps {
  searchParams: Promise<{
    rank?: string;
  }>;
}

/**
 * 검색 파라미터에서 `rank` 값을 읽어 `ResultProvider`에 전달하고 `TicketResult`를 렌더링합니다.
 *
 * @param searchParams - `rank` (선택적 문자열)을 포함한 검색 파라미터 객체로 해석되는 프로미스
 * @returns `rank`를 prop으로 받은 `ResultProvider`로 `TicketResult`를 감싼 React 노드
 */
export default async function TicketResultPage({
  searchParams,
}: TicketResultPageProps) {
  const resolvedSearchParams = await searchParams;
  const rank = resolvedSearchParams.rank;

  return (
    <ResultProvider rank={rank}>
      <TicketResult />
    </ResultProvider>
  );
}