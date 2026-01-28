"use client";

import { useReservationData } from "../../contexts/ReservationProvider";
import { gradeInfoColor } from "../../data/seat";

/**
 * Render a list of seat grades with a colored swatch and formatted price for each grade.
 *
 * Retrieves `grades` from the reservation context and renders a styled container
 * where each grade row shows a color square (from `gradeInfoColor`), the grade name,
 * and the price formatted with thousand separators followed by "원".
 *
 * @returns A JSX element containing the seat grade list with colored swatches and formatted prices.
 */
export default function SeatGradeInfo() {
  const { grades } = useReservationData();

  return (
    <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h4 className="text-sm mb-3">좌석 등급 & 가격</h4>
      <div className="space-y-2">
        {grades.map((grade) => (
          <div key={grade.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: gradeInfoColor[grade.name].fillColor,
                }}
              ></div>
              <span className="text-sm text-gray-700">{grade.name}</span>
            </div>
            <span className="text-sm text-gray-600">
              {grade.price.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}