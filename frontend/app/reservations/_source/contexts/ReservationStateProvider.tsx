"use client";

import { createContext, ReactNode, use, useState } from "react";
import { useRouter } from "next/navigation";
import useSelection from "@/hooks/useSelector";
import { RESERVATION_LIMIT } from "../constants/reservationConstants";
import { Seat } from "../types/reservationType";
import { useTimeLogStore } from "@/hooks/timeLogStore";

interface ReservationStateContextValue {
  selectedSeats: ReadonlyMap<string, Seat>;
  area: string | null;
}

interface ReservationDispatchContextValue {
  handleToggleSeat: (seatId: string, seat: Seat) => void;
  handleRemoveSeat: (seatId: string) => void;
  handleResetSeats: () => void;
  handleClickReserve: () => void;
  handleSelectArea: (areaId: string) => void;
  handleDeselectArea: () => void;
  completeCaptcha: () => void;
}

export const ReservationStateContext =
  createContext<ReservationStateContextValue | null>(null);
export const ReservationDispatchContext =
  createContext<ReservationDispatchContextValue | null>(null);

interface ReservationStateProviderProps {
  children: ReactNode;
}

/**
 * 예약 상태 및 예약 조작 액션을 하위 컴포넌트에 제공하는 컨텍스트 프로바이더를 렌더링합니다.
 *
 * @param children - 프로바이더로 감쌀 자식 요소들
 * @returns 예약 상태(선택된 좌석, 선택된 구역)와 예약 관련 액션들을 포함한 컨텍스트 프로바이더로 감싼 React 노드
 */
export function ReservationStateProvider({
  children,
}: ReservationStateProviderProps) {
  const {
    selected: selectedSeats,
    toggle: handleToggleSeat,
    remove: handleRemoveSeat,
    reset: handleResetSeats,
  } = useSelection<string, Seat>(new Map(), { max: RESERVATION_LIMIT });

  const endSeatSelection = useTimeLogStore((state) => state.endSeatSelection); // 체류 시간 측정

  const [area, setArea] = useState<string | null>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const completeCaptcha = () => {
    setIsCaptchaVerified(true);
  };

  const handleSelectArea = (areaId: string) => {
    setArea(areaId);
  };

  const handleDeselectArea = () => {
    setArea(null);
  };

  const router = useRouter();

  const handleClickReserve = () => {
    try {
      // throw new Error("예매 실패");
      if (!isCaptchaVerified) {
        alert("보안문자가 입력되지 않았습니다.");
        return;
      }
      endSeatSelection();
      router.push("/result");
    } catch (e) {
      console.error(e);
      alert("예매에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const stateValue: ReservationStateContextValue = {
    selectedSeats,
    area,
  };

  const dispatchValue: ReservationDispatchContextValue = {
    handleToggleSeat,
    handleRemoveSeat,
    handleResetSeats,
    handleClickReserve,
    handleSelectArea,
    handleDeselectArea,
    completeCaptcha,
  };

  return (
    <ReservationStateContext.Provider value={stateValue}>
      <ReservationDispatchContext.Provider value={dispatchValue}>
        {children}
      </ReservationDispatchContext.Provider>
    </ReservationStateContext.Provider>
  );
}

export function useReservationState() {
  const context = use(ReservationStateContext);
  if (!context) {
    throw new Error("ReservationStateProvider가 필요합니다.");
  }
  return {
    ...context,
    isShowArea: !!context.area,
  };
}

export function useReservationDispatch() {
  const context = use(ReservationDispatchContext);
  if (!context) {
    throw new Error("ReservationDispatchProvider가 필요합니다.");
  }
  return context;
}