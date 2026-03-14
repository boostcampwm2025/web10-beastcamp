"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Heart, ChevronRight } from "lucide-react";
import { Performance, Session } from "@/types/performance";
import Yes24Calendar from "./Yes24Calendar";
import { useRouter } from "next/navigation";
import { useTicketContext } from "@/contexts/TicketContext";
import { VenueDetail } from "@/types/venue";
import { useResetAuthToken } from "@/hooks/useResetAuthToken";
import ExternalBookingBanner from "@/components/ui/common/ExternalBookingBanner";

interface Yes24PerformanceDetailProps {
  performance: Performance;
  sessions: Session[];
  venue: VenueDetail | null;
}

const UNDEFINED_MESSAGE = "예매처에서 확인 가능";

export default function Yes24PerformanceDetail({
  performance,
  sessions,
  venue,
}: Yes24PerformanceDetailProps) {
  const router = useRouter();
  const { setPerformance, selectSession, setVenue } = useTicketContext();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(436);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useResetAuthToken();

  // 티켓팅 오픈 여부 계산 (페이지 로드 시 한 번만 계산, 이후 새로고침 필요)
  const isTicketingOpen = useMemo(() => {
    if (!performance.ticketing_date) return false;
    const now = new Date().getTime();
    const ticketingTime = new Date(performance.ticketing_date).getTime();
    return now >= ticketingTime;
  }, [performance.ticketing_date]);

  // 날짜 선택 핸들러 - 날짜 변경 시 선택된 회차 초기화
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSession(null);
  };

  // 날짜 범위 계산
  let dateRange = "";
  if (sessions && sessions.length > 0) {
    const dates = sessions.map((s) => new Date(s.sessionDate).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    };

    if (minDate.getTime() === maxDate.getTime()) {
      dateRange = formatDate(minDate);
    } else {
      dateRange = `${formatDate(minDate)} ~ ${formatDate(maxDate)}`;
    }
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleReservation = () => {
    if (selectedDate && selectedSession && isTicketingOpen && venue) {
      // Context에 공연 정보와 세션 정보 저장
      setPerformance(performance);
      const session = sessions.find((s) => s.id.toString() === selectedSession);
      if (session) {
        selectSession(session);
      }
      setVenue(venue);

      // URL로도 세션 ID 전달
      router.push(`/waiting-queue?sId=${selectedSession}`);
    }
  };

  // 티켓 오픈 시각 포맷팅
  const formatTicketOpenTime = () => {
    if (!performance.ticketing_date) return "";

    const ticketDate = new Date(performance.ticketing_date);
    const month = ticketDate.getMonth() + 1;
    const day = ticketDate.getDate();
    const hours = ticketDate.getHours();
    const minutes = ticketDate.getMinutes();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
      ticketDate.getDay()
    ];
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes > 0 ? `${minutes}분` : "";

    return `${month}월 ${day}일(${dayOfWeek}) ${period} ${displayHours}시${displayMinutes ? ` ${displayMinutes}` : ""} 티켓 오픈`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 태그 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">콘서트</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">국내뮤지션</span>
          </div>
        </div>
      </div>

      {/* 타이틀 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              단독판매
            </span>
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
              지금 예매 받기
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {performance.performance_name}
          </h1>
          <p className="text-sm text-gray-600">{dateRange}</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 포스터 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-3/4">
                <Image
                  src={performance.poster_url || "/images/poster.jpg"}
                  alt={performance.performance_name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* 좋아요 버튼 */}
              <div className="p-4 border-t">
                <button
                  onClick={handleLike}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                  <span className="text-sm text-gray-700">{likeCount}</span>
                  <span className="text-sm text-gray-600">Likes</span>
                </button>
              </div>
            </div>
          </div>

          {/* 우측: 상세 정보 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* 기본 정보 테이블 */}
              <div className="space-y-4">
                <div className="flex border-b pb-3">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    등급
                  </div>
                  <div className="flex-1 text-gray-900 text-sm">
                    {performance.age_limit || UNDEFINED_MESSAGE}
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    관람시간
                  </div>
                  <div className="flex-1 text-gray-900 text-sm">
                    {performance.runtime || UNDEFINED_MESSAGE}
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    출연
                  </div>
                  <div className="flex-1 text-gray-900 text-sm">
                    {performance.cast_info || UNDEFINED_MESSAGE}
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    가격
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">VIP석</span>
                      <span className="text-red-600 font-medium text-sm line-through">
                        154,000원
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">R석</span>
                      <span className="text-gray-900 font-medium text-sm">
                        143,000원
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">S석</span>
                      <span className="text-gray-900 font-medium text-sm">
                        132,000원
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    혜택
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded whitespace-nowrap">
                        사용가능쿠폰(0)
                      </span>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        무이자할부
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        제휴카드할인
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        제휴카드무이자
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-24 text-gray-600 font-medium text-sm">
                    배송정보
                  </div>
                  <div className="flex-1 text-gray-700 text-sm">
                    현장 수령만 가능
                  </div>
                </div>
              </div>

              {/* 공연시간 안내 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">
                  공연시간 안내
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>2026년 1월 24일(토) 오후 6시</p>
                  <p>2026년 1월 25일(일) 오후 5시</p>
                </div>
              </div>

              {/* 배송정보 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">
                  배송정보
                </h3>
                <p className="text-sm text-gray-700">현장 수령만 가능</p>
              </div>
            </div>

            {/* 보안문자 안내 */}
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-bold">본 상품은</span>{" "}
                  <span className="text-red-600 font-bold">
                    자동예매방지(CAPTCHA)
                  </span>
                  가 적용된 상품입니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 날짜/시간 선택 - 티켓팅 오픈 후에만 표시 */}
        {isTicketingOpen && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 좌측: 날짜/시간 선택 */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-900">
                  <h2 className="text-2xl font-bold text-gray-900">
                    날짜/시간 선택
                  </h2>
                  <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                    캘린더일괄
                  </button>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1">
                    <Yes24Calendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      sessions={sessions}
                    />
                  </div>
                  <div className="w-56 space-y-2">
                    {selectedDate ? (
                      sessions
                        .filter((session) => {
                          const sessionDate = new Date(session.sessionDate);
                          return (
                            sessionDate.getFullYear() ===
                              selectedDate.getFullYear() &&
                            sessionDate.getMonth() ===
                              selectedDate.getMonth() &&
                            sessionDate.getDate() === selectedDate.getDate()
                          );
                        })
                        .map((session, index) => {
                          const date = new Date(session.sessionDate);
                          const hours = date.getHours();
                          const minutes = date.getMinutes();
                          const period = hours < 12 ? "오전" : "오후";
                          const displayHours =
                            hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                          const displayMinutes = String(minutes).padStart(
                            2,
                            "0",
                          );

                          return (
                            <button
                              key={session.id}
                              onClick={() =>
                                setSelectedSession(session.id.toString())
                              }
                              className={`w-full py-3 text-center text-sm font-bold rounded transition-colors ${
                                selectedSession === session.id.toString()
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {index + 1}회 {period} {displayHours}시{" "}
                              {displayMinutes}분
                            </button>
                          );
                        })
                    ) : (
                      <div className="text-center text-sm text-gray-500 py-3">
                        날짜를 먼저 선택해주세요
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 예매 가능 좌석 */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-900">
                  예매 가능 좌석
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-900 font-medium">
                      OP석 190,000원
                    </span>
                    <span className="text-red-500 text-sm">(잔여:매진)</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-900 font-medium">
                      R석 190,000원
                    </span>
                    <span className="text-red-500 text-sm">(잔여:매진)</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-900 font-medium">
                      S석 160,000원
                    </span>
                    <span className="text-red-500 text-sm">(잔여:매진)</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-900 font-medium">
                      A석 130,000원
                    </span>
                    <span className="text-red-500 text-sm">(잔여:1석)</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-900 font-medium">
                      B석 90,000원
                    </span>
                    <span className="text-red-500 text-sm">(잔여:매진)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handleReservation}
            disabled={!isTicketingOpen || !selectedDate || !selectedSession}
            className={`px-32 py-4 rounded font-bold text-lg transition-colors ${
              isTicketingOpen && selectedDate && selectedSession
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isTicketingOpen ? "예매하기" : formatTicketOpenTime()}
          </button>
          <button className="px-20 py-4 rounded border-2 border-gray-300 bg-white text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors">
            GLOBAL BOOKING
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pb-8 mt-20 border-t border-gray-300">
        <ExternalBookingBanner performance={performance} />
      </div>
    </div>
  );
}
