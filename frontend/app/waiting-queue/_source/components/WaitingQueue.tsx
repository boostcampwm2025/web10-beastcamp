import WaitingProgress from "./WaitingProgress";
import WaitingHeader from "./WaitingHeader";
import WaitingNotice from "./WaitingNotice";

/**
 * 대기열 화면을 중앙에 정렬된 전체 화면 레이아웃으로 렌더링합니다.
 *
 * 내부적으로 대기 상태 헤더(WaitingHeader), 진행 표시(WaitingProgress), 알림(WaitingNotice)를
 * 카드 형태의 컨테이너에 배치하고 그 뒤에 그라데이션 배경을 적용합니다.
 *
 * @returns 대기열 UI를 표현하는 React 요소
 */
export default function WaitingQueue() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
        <div className="py-8">
          <WaitingHeader />
          <div className="max-w-md mx-auto">
            <WaitingProgress />
            <WaitingNotice />
          </div>
        </div>
      </div>
    </div>
  );
}