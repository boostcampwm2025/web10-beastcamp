"use client";

import { useEffect } from "react";
import {
  NetworkStatusType,
  useNetworkLatency,
} from "../../hooks/useNetworkLatency";
import NetworkMetrics from "./NetworkMetrics";
import NetworkStatusHeader from "./NetworkStatusHeader";
import NetworkStatusInfo from "./NetworkStatusInfo";

const getStatusColor = (
  grade: NetworkStatusType["grade"],
  isError: boolean,
) => {
  if (isError) return "text-red-400 bg-red-400/5 border-red-400/10";
  switch (grade) {
    case "very-good":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "good":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "bad":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
};

/**
 * Displays current network latency, bandwidth, and status with controls and diagnostics.
 *
 * On mount, triggers an initial network check after a 200ms delay and updates the displayed
 * status, message, and optional metrics based on the hook-provided results and error state.
 *
 * @returns The rendered NetworkStatus React element showing status header, message,
 *          optional metrics (when not in an error state), and additional status info.
 */
export default function NetworkStatus() {
  const { pings, bandwidth, grade, message, checkNetwork, isError } =
    useNetworkLatency();
  // 0.2초 후에 초기 fetch 진행 (사이트 초기 진입시에는 받아오는 파일들이 여러 존재하기에 제대로 된 측정이 되지 않음)
  useEffect(() => {
    const timer = setTimeout(() => {
      checkNetwork();
    }, 200);
    return () => clearTimeout(timer);
  }, [checkNetwork]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="w-full mb-6">
        <div
          className={`rounded-2xl border backdrop-blur-md p-4 transition-all duration-300 ${getStatusColor(grade, isError)}`}
        >
          <NetworkStatusHeader
            grade={isError ? "bad" : grade}
            isError={isError}
            checkNetwork={checkNetwork}
          />

          <p className="text-sm font-medium mb-3 opacity-90">{message}</p>

          {!isError && grade && (
            <NetworkMetrics pings={pings} bandwidth={bandwidth} />
          )}

          <NetworkStatusInfo />
        </div>
      </div>
    </section>
  );
}