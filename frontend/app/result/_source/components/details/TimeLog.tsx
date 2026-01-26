"use client";

import { Clock } from "lucide-react";
import { useTimeLogStore } from "@/hooks/timeLogStore";
import { formatTime } from "@/lib/utils";

/**
 * 단계별 소요 시간을 표시하는 카드형 React 컴포넌트.
 *
 * 각 단계(대기열 통과, 보안문자 입력, 좌석 선택)와 총 소요 시간을 포맷하여 보여주는 UI를 반환한다.
 *
 * @returns 단계별 및 총 소요 시간을 포함하는 JSX 요소
 */
export default function TimeLog() {
  const { waitingQueue, captcha, seatSelection, getTotalDuration } =
    useTimeLogStore();

  const totalTime = getTotalDuration();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h4 className="mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" />
        단계별 소요 시간
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">대기열 통과</span>
          <span>{formatTime(waitingQueue.duration)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">보안문자 입력</span>
          <span>{formatTime(captcha.duration)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">좌석 선택</span>
          <span>{formatTime(seatSelection.duration)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span>총 소요 시간</span>
          <span className="text-purple-600">{formatTime(totalTime)}</span>
        </div>
      </div>
    </div>
  );
}