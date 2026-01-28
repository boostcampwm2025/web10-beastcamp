"use client";

import {
  useReservationState,
  useReservationDispatch,
} from "../../contexts/ReservationProvider";
import { gradeInfoColor } from "../../data/seat";

/**
 * Render a list of currently selected seats or a centered prompt when no seats are selected.
 *
 * Each list item displays the seat grade (styled using gradeInfoColor for the grade name),
 * the block/row/column location, a right-aligned price, and a remove button that calls the reservation dispatch's remove handler for that seat.
 *
 * @returns A React element showing either the "select seats" message when there are no selections or the list of selected seat entries.
 */
export default function SelectedSeatsList() {
  const { selectedSeats } = useReservationState();
  const { handleRemoveSeat } = useReservationDispatch();

  if (selectedSeats.size === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        좌석을 선택해주세요
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from(selectedSeats).map(([key, seat]) => (
        <div
          key={key}
          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div
                className={`text-sm ${
                  gradeInfoColor[seat.seatGrade.name].textColor
                }`}
              >
                {seat.seatGrade.name}
              </div>
              <div className="text-xs text-gray-500">
                {seat.blockNum}구역 {seat.rowNum} {seat.colNum} 번
              </div>
            </div>
            <button
              onClick={() => handleRemoveSeat(seat.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-right">
            <span className="text-sm">
              {"" + seat.seatGrade.price.toLocaleString()}원
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}