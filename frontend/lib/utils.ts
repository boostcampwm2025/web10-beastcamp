import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 여러 ClassValue를 받아 단일의 정리된 Tailwind 클래스 문자열로 병합합니다.
 *
 * @param inputs - 문자열, 배열, 객체 등 clsx가 허용하는 클래스 값들
 * @returns 중복 및 충돌하는 Tailwind 클래스를 병합한 단일 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 초 단위의 시간을 한국어 표현으로 변환한다.
 *
 * <p>60초 미만이면 소수점 둘째 자리까지 표시한 `<n.nn>초`를 반환하고, 60초 이상이면 분 단위로 변환하여
 * 남은 초가 0이면 `<m>분`, 그렇지 않으면 `<m>분 <s>초` 형식의 문자열을 반환한다.</p>
 *
 * @param seconds - 포맷할 시간(초)
 * @returns 60초 미만이면 소수점 둘째 자리까지의 `"<n.nn>초"`, 60초 이상이면 `" <m>분"` 또는 `"<m>분 <s>초"` 형식의 문자열
 */
export function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}초`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${Math.floor(remainingSeconds)}초`;
}