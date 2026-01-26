"use client";

import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import { useTimeLogStore } from "@/hooks/timeLogStore";

// 동적 import로 클라이언트 전용 로드 (SSR 비활성화)
const CaptchaVerification = dynamic(
  () =>
    import("./captcha-verification").then((mod) => ({
      default: mod.CaptchaVerification,
    })),
  { ssr: false },
);

interface CaptchaModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onClose: () => void;
}

/**
 * CAPTCHA 컴포넌트가 로드되는 동안 표시되는 로딩 상태 UI를 렌더링합니다.
 *
 * 카드 형태의 레이아웃으로 아이콘·제목·설명·스피너·상태 메시지를 표시하여 사용자가 CAPTCHA가 로드 중임을 인식하게 합니다.
 *
 * @returns 로딩 상태를 나타내는 React 요소
 */
function CaptchaLoadingFallback() {
  return (
    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <h3 className="text-2xl mb-2 text-center">보안문자 입력</h3>
      <p className="text-gray-500 mb-8 text-center">
        아래 문자를 정확히 입력해주세요
      </p>
      <div className="bg-gray-100 rounded-lg p-8 mb-6">
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">
        보안 문자를 불러오는 중...
      </p>
    </div>
  );
}

/**
 * 캡차 로드 실패 시 오류 메시지와 재시도 버튼을 표시하는 폼을 렌더합니다.
 *
 * 오류가 Error 인스턴스면 그 메시지를, 그렇지 않으면 기본 오류 메시지를 화면에 보여주고
 * 사용자가 "다시 시도" 버튼을 누르면 제공된 콜백을 호출합니다.
 *
 * @param error - 발생한 오류 객체(또는 오류 원인). Error 인스턴스인 경우 메시지를 표시합니다.
 * @param resetErrorBoundary - 재시도 시 호출되는 콜백 함수
 * @returns 캡차 로드 실패 상태를 보여주는 React 요소 (오류 아이콘, 메시지, 재시도 버튼)
 */
function CaptchaErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const errorMessage =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  return (
    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-2xl mb-2 text-center">오류 발생</h3>
      <p className="text-gray-500 mb-8 text-center">
        보안 문자를 불러오는데 실패했습니다
      </p>
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
        <p className="text-sm text-red-600 text-center">{errorMessage}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
      >
        다시 시도
      </button>
    </div>
  );
}

/**
 * CAPTCHA 모달을 표시하고 검증 성공 시 타이밍 로그를 기록한 뒤 상위 콜백을 호출한다.
 *
 * 모달이 열리면 CAPTCHA 체류 시간 측정이 시작되고, CAPTCHA 검증이 완료되면 체류 측정이 종료되고 좌석 선택 측정이 시작된다.
 *
 * @param isOpen - 모달을 화면에 표시할지 여부
 * @param onVerified - CAPTCHA 검증 성공 시 호출되는 콜백
 * @param onClose - 모달을 닫기 위한 콜백 (현재 내부에서 직접 호출되지는 않음; 상위에서 사용)
 * @returns 열려 있으면 CAPTCHA 모달의 React 요소를 렌더링하고, 닫혀 있으면 `null`
 */
export function CaptchaModal({
  isOpen,
  onVerified,
  onClose,
}: CaptchaModalProps) {
  const startCaptcha = useTimeLogStore((state) => state.startCaptcha);
  const endCaptcha = useTimeLogStore((state) => state.endCaptcha);
  const startSeatSelection = useTimeLogStore(
    (state) => state.startSeatSelection,
  );

  // 모달 체류 시간 측정 시작
  useEffect(() => {
    if (isOpen) {
      startCaptcha();
    }
  }, [isOpen, startCaptcha]);

  const handleVerified = () => {
    endCaptcha();
    startSeatSelection();
    onVerified();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <ErrorBoundary FallbackComponent={CaptchaErrorFallback}>
          <Suspense fallback={<CaptchaLoadingFallback />}>
            <CaptchaVerification onVerified={handleVerified} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}