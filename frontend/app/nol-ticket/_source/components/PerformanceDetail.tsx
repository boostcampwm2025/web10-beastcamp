"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ChevronRight } from "lucide-react";
import { Performance, Session } from "@/types/performance";
import DetailDateSelector from "./DetailDateSelector";
import DetailRoundSelector from "./DetailRoundSelector";
import { useRouter } from "next/navigation";
import { useTicketContext } from "@/contexts/TicketContext";
import { VenueDetail } from "@/types/venue";
import { useResetAuthToken } from "@/hooks/useResetAuthToken";

import ExternalBookingBanner from "../../../../components/ui/common/ExternalBookingBanner";

interface PerformanceDetailProps {
  performance: Performance;
  sessions: Session[];
  venue: VenueDetail;
}

const UNDEFINED_MESSAGE = "예매처에서 확인 가능";

export default function PerformanceDetail({
  performance,
  sessions,
  venue,
}: PerformanceDetailProps) {
  const router = useRouter();

  const { setPerformance, selectSession, setVenue } = useTicketContext();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(2076);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isActive, setIsActive] = useState(false);

  useResetAuthToken();
  /*
   개발 모드에서 테스트 하려고 마감 시간을 항상 현재시간 + 10초로 잡음
  const [target, setTarget] = useState<number>(
    new Date(new Date().getTime() + 10000).getTime(),
  );
  */

  // 카운트다운 계산
  useEffect(() => {
    if (!performance?.ticketing_date) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();

      const target = new Date(performance.ticketing_date).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsActive(true);
        setTimeLeft(null);
        return;
      }

      setIsActive(false);

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [performance?.ticketing_date]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedRound && venue) {
      // Context에 공연 정보와 세션 정보 저장
      setPerformance(performance);
      const session = sessions.find((s) => s.id.toString() === selectedRound);
      if (session) {
        selectSession(session);
      }
      setVenue(venue);

      // URL로도 세션 ID 전달
      router.push(`/waiting-queue?sId=${selectedRound}`);
      // console.log("예매 확정:", { selectedDate, selectedRound, session });
    }
  };

  const onDateSelect = (date: Date | undefined) => {
    if (date === selectedDate) return;
    if (!date) return;
    setSelectedDate(date);
    setSelectedRound(null);
  };

  // 날짜 범위 계산
  let dateRange = "";
  if (sessions && sessions.length > 0) {
    const dates = sessions.map((s) => new Date(s.sessionDate).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatDate = (d: Date) =>
      d
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, "");

    if (minDate.getTime() === maxDate.getTime()) {
      dateRange = formatDate(minDate);
    } else {
      dateRange = `${formatDate(minDate)} ~ ${formatDate(maxDate)}`;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 태그 */}
      <nav className=" bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              단독판매
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              안심예매
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              예매대기
            </span>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* 제목 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {performance.performance_name}
          </h1>
          <p className="text-gray-600">콘서트 주간 2회</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 좌측: 포스터 이미지 */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={performance.poster_url || "/images/poster.jpg"}
                  alt={performance.performance_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* 좋아요 버튼 */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="text-sm">티켓캐스트</span>
                  <span className="font-semibold">{likeCount}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 중앙: 공연 정보 */}
          <div className="lg:col-span-5 space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">장소</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{venue.venueName || "올림픽공원 올림픽홀"}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">공연기간</div>
                <div className="flex-1 text-gray-900">{dateRange}</div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">공연시간</div>
                <div className="flex-1 text-gray-900">
                  {performance.runtime || UNDEFINED_MESSAGE}
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">관람연령</div>
                <div className="flex-1 text-gray-900">
                  {performance.age_limit || UNDEFINED_MESSAGE}
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">가격</h2>
                <button className="text-sm text-purple-600 font-medium flex items-center gap-1">
                  전체가격보기
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">스탠딩</span>
                  <span className="font-semibold text-gray-900">132,000원</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">지정석 SR</span>
                  <span className="font-semibold text-gray-900">143,000원</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">지정석 R</span>
                  <span className="font-semibold text-gray-900">132,000원</span>
                </div>
              </div>
            </div>

            {/* 혜택 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">혜택</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    NOL카드
                  </span>
                  <span className="text-sm text-gray-700">
                    NOL 카드 티켓 10만원 할인쿠폰
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    taping
                  </span>
                  <span className="text-sm text-gray-700">
                    기입하고 증폭할인! 쿠폰받기
                  </span>
                </div>
              </div>
            </div>

            {/* 프로모션 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">프로모션</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block px-2 py-1 bg-yellow-400 text-gray-900 font-bold rounded">
                  ●pay
                </span>
                <span className="text-gray-700">
                  카카오머니 결제 시 4천원 즉시할인(일 선착순)
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* 배송 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">배송</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>2026년 02월 04일 일괄 배송되는 상품입니다.</p>
                <p>2월 4일(수) ~ 6일(금), 3일간</p>
                <button className="text-purple-600 font-medium flex items-center gap-1">
                  배송주소 확인
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 유의사항 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">유의사항</h2>
              <p className="text-sm text-gray-700">
                2026년 01월 20일 00시 00분~2026년 01월 27일 18시 00분까지
                무통장입금 결제가 불가능합니다.
              </p>
            </div>
          </div>

          {/* 우측: 예약 패널 */}
          <div className="lg:col-span-4 ml-10">
            <div className="sticky top-24">
              {!isActive ? (
                <>
                  <button
                    onClick={handleConfirm}
                    disabled
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      selectedDate && selectedRound
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    남은시간 {timeLeft?.hours.toString().padStart(2, "0")}:
                    {timeLeft?.minutes.toString().padStart(2, "0")}:
                    {timeLeft?.seconds.toString().padStart(2, "0")}
                  </button>

                  <button className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                    NOL 카드 쓸 때마다 10% 적립
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                    이 공연이 더 궁금하다면
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* 티켓팅 시작 후 or 개발 모드 - 날짜/회차 선택 표시 */
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    관람일
                  </h2>

                  <DetailDateSelector
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    sessions={sessions}
                  />

                  <div className="mt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      회차
                    </h2>
                    <DetailRoundSelector
                      selectedRound={selectedRound}
                      onRoundSelect={setSelectedRound}
                      sessions={sessions}
                      selectedDate={selectedDate}
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedDate || !selectedRound}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                        selectedDate && selectedRound
                          ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      예매하기
                    </button>

                    <button className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                      NOL 카드 쓸 때마다 10% 적립
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                      이 공연이 더 궁금하다면
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pb-8 mt-20">
          <ExternalBookingBanner performance={performance} />
        </div>
      </main>
    </div>
  );
}
