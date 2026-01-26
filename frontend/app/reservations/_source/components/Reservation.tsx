import { ReservationProvider } from "../contexts/ReservationProvider";
import ReservationStage from "./stage/ReservationStage";
import ReservationSidebar from "./sidebar/ReservationSidebar";
import { getBlockGrades, getGradeInfo } from "@/services/venue";
import ReservationHeader from "./header/ReservationHeader";
import Captcha from "./Captcha";

interface ReservationProps {
  searchParams: Promise<{ sId?: string }>;
}

/**
 * 세션 식별자(sId)를 검증하고 관련 등급 데이터를 가져와 예약 UI를 렌더링합니다.
 *
 * 서버로부터 세션의 블록 등급과 등급 정보를 조회하여 ReservationProvider로 감싼 예약 페이지(캡차, 헤더, 스테이지, 사이드바)를 반환합니다.
 *
 * @param searchParams - `sId` 쿼리 문자열을 포함하는 프로미스; `sId`는 렌더링할 세션의 식별자입니다.
 * @throws {Error} `sId`가 없거나 정수로 변환할 수 없을 경우 `"INVALID_ACCESS"` 메시지의 Error를 던집니다.
 * @returns ReservationProvider로 감싼 예약 관련 React 요소(블록 등급 및 등급 정보를 컨텍스트로 제공).
 */
export default async function Reservation({ searchParams }: ReservationProps) {
  const { sId } = await searchParams;

  if (!sId) {
    throw new Error("INVALID_ACCESS");
  }

  const sessionId = parseInt(sId, 10);

  if (isNaN(sessionId)) {
    throw new Error("INVALID_ACCESS");
  }

  const [blockGrades, grades] = await Promise.all([
    getBlockGrades(sessionId),
    getGradeInfo(sessionId),
  ]);

  return (
    <ReservationProvider blockGrades={blockGrades} grades={grades}>
      <Captcha />
      <div className="h-screen flex flex-col overflow-hidden">
        <ReservationHeader />
        <div className="flex-1 flex overflow-hidden min-h-0">
          <ReservationStage />
          <ReservationSidebar />
        </div>
      </div>
    </ReservationProvider>
  );
}