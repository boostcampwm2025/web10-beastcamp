import { Suspense, useEffect, useState } from "react";
import {
  useReservationData,
  useReservationState,
  useReservationDispatch,
} from "../../contexts/ReservationProvider";
import { gradeInfoColor } from "../../data/seat";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const AreaSeats = dynamic(() => import("./AreaSeats"), {
  ssr: false,
});

/**
 * Render interactive stage map or area seat view for the current venue.
 *
 * Loads the venue's SVG map (respecting mock vs. API URL mode), applies grade-based fill colors to blocks,
 * and dispatches area selection when a block is clicked. When `isShowArea` is true, renders the `AreaSeats`
 * view wrapped in an error boundary and suspense.
 *
 * @returns A React element that displays either the SVG stage map with dynamic styles and click handling or the `AreaSeats` component.
 */
export default function StageMap() {
  const { venue, blockGrades } = useReservationData();
  const { isShowArea } = useReservationState();
  const { handleSelectArea } = useReservationDispatch();

  const blockMapUrl = venue?.blockMapUrl;

  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!blockMapUrl) return;

    const fetchSvg = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_MODE === "mock"
            ? blockMapUrl
            : process.env.NEXT_PUBLIC_API_URL + blockMapUrl,
        ); // 일단 public에 넣어둔 상태라 api mock하면 에러남 고로 api.get 대신 fetch사용
        const text = await response.text();
        setSvgContent(text);
      } catch (err) {
        console.error("svg로딩에러", err);
      }
    };
    fetchSvg();
  }, [blockMapUrl]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const blockElement = target.closest("[data-block-name]");
    const blockName = blockElement?.getAttribute("data-block-name");

    if (blockName) {
      const block = venue?.blocks.find((b) => b.blockDataName === blockName);
      if (block) {
        handleSelectArea(String(block.id));
      }
    }
  };

  const blockColorMap = (() => {
    if (!venue?.blocks || !blockGrades) return {};

    const map: Record<string, string> = {};

    venue.blocks.forEach((block) => {
      const blockGrade = blockGrades.find((bg) => bg.blockId === block.id);
      if (blockGrade) {
        const color = gradeInfoColor[blockGrade.grade.name]?.fillColor;
        if (color) {
          map[block.blockDataName] = color;
        }
      }
    });

    return map;
  })();

  const dynamicStyles = Object.entries(blockColorMap)
    .map(
      ([name, color]) => `
        [data-block-name="${name}"] { fill: ${color} !important; transition: opacity 0.2s; } 
        [data-block-name="${name}"]:hover { cursor: pointer; }
      `,
    )
    .join("\n");

  return (
    <div className="relative h-full w-full bg-[#EDEFF3] rounded-lg overflow-hidden flex items-center justify-center">
      <div className="relative h-full w-full flex items-center justify-center">
        {isShowArea ? (
          <ErrorBoundary
            fallback={
              <div>구역 좌석 정보를 불러오는 중 오류가 발생했습니다.</div>
            }
          >
            <Suspense>
              <AreaSeats />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <div className="relative w-127.5 h-108.75">
            <>
              <style>{dynamicStyles}</style>
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full select-none pointer-events-auto"
                dangerouslySetInnerHTML={{
                  __html: svgContent ? svgContent : "",
                }}
                onClick={handleStageClick}
              />
            </>
          </div>
        )}
      </div>
    </div>
  );
}