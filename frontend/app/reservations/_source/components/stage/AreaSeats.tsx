"use client";

import { useSearchParams } from "next/navigation";

import {
  useReservationData,
  useReservationState,
  useReservationDispatch,
} from "../../contexts/ReservationProvider";
import { gradeInfoColor } from "../../data/seat";
import { Seat } from "../../types/reservationType";
import { useReservationSeatsQuery } from "../../queries/seat";

/**
 * Render a seat-selection interface for the currently selected venue area.
 *
 * Displays a header with refresh and "map view" controls, a centered "Stage" label,
 * and a grid of seats organized by rows. Each seat reflects reservation state (disabled if reserved),
 * highlights selected seats, and uses the area's grade color. Seat buttons toggle selection when available.
 *
 * @returns A React element containing the area seat picker with refresh and deselect controls, a stage label, and a row/seat grid where reserved seats are disabled and selected seats are visually indicated.
 */
export default function AreaSeats() {
  const searchParams = useSearchParams();
  const sessionId = Number(searchParams.get("sId"));

  const { venue, blockGrades, grades } = useReservationData();
  const { area, selectedSeats } = useReservationState();
  const { handleDeselectArea, handleToggleSeat } = useReservationDispatch();
  const { data: reservationData, refetch } = useReservationSeatsQuery(
    sessionId,
    area,
  );

  const targetBlock = venue?.blocks.find((b) => String(b.id) === area);
  const blockGrade = blockGrades?.find((bg) => bg.blockId === targetBlock?.id);

  if (!targetBlock) return <div>구역 정보를 찾을 수 없습니다.</div>;

  const rows = [];
  const { rowSize, colSize, blockDataName } = targetBlock;
  const grade = blockGrade?.grade;

  const gradeColor = gradeInfoColor[grade?.name || ""]?.fillColor || "#374151";

  for (let r = 1; r <= rowSize; r++) {
    const seats: Seat[] = [];
    for (let c = 1; c <= colSize; c++) {
      const seatId = `${blockDataName}-${r}-${c}`;
      const isReserved = reservationData?.seats?.[r - 1]?.[c - 1] ?? false;

      seats.push({
        id: seatId,
        seatGrade: grade || grades[0],
        rowNum: r + "",
        colNum: c + "",
        blockNum: targetBlock.blockDataName,
        isReserved,
      });
    }
    rows.push({ rowNum: String(r), seats });
  }

  return (
    <div className="h-full w-full bg-white flex flex-col rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b flex items-center justify-between bg-white z-10 sticky top-0">
        <h2 className="text-lg font-bold">
          {targetBlock.blockDataName} 구역 좌석 선택
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            새로고침
          </button>
          <button
            onClick={handleDeselectArea}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            지도 보기
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
        <div className="flex flex-col gap-3 items-center min-w-max mx-auto">
          <div className="w-full max-w-lg text-center py-1.5 mb-6 bg-gray-200/50 text-gray-400 text-xs font-bold rounded tracking-widest uppercase">
            Stage
          </div>

          {rows.map(({ rowNum, seats }) => (
            <div key={rowNum} className="flex gap-4 items-center p-1">
              <div className="w-8 text-right text-gray-400 font-bold text-xs">
                {rowNum}열
              </div>
              <div className="flex gap-1.5">
                {seats.map((seat) => {
                  const isSelected = selectedSeats.has(seat.id);
                  const isReserved = seat.isReserved;

                  return (
                    <button
                      key={seat.id}
                      disabled={isReserved}
                      onClick={() => handleToggleSeat(seat.id, seat)}
                      className={`w-6 h-6 rounded-md text-[10px] font-medium flex items-center justify-center text-white ${
                        isReserved
                          ? "bg-gray-300 cursor-not-allowed"
                          : isSelected
                            ? "z-10 border-2 border-gray-900"
                            : "hover:opacity-80"
                      }`}
                      style={{
                        backgroundColor: isReserved ? "#d1d5db" : gradeColor,
                      }}
                      title={`${seat.rowNum}열 ${seat.colNum}번${
                        isReserved ? " (예약됨)" : ""
                      }`}
                    ></button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}