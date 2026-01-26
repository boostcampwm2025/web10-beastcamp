"use client";

import { createContext, useContext, ReactNode } from "react";

interface ResultContextValue {
  rank?: string;
}

const ResultContext = createContext<ResultContextValue | null>(null);

interface ResultProviderProps {
  children: ReactNode;
  rank?: string;
}

/**
 * 주어진 `rank` 값을 컨텍스트로 제공하고 자식 요소들을 해당 컨텍스트 내부에서 렌더링합니다.
 *
 * @param children - Provider로 감싸서 렌더링할 React 노드들
 * @param rank - Provider가 하위 컴포넌트에 제공할 순위 문자열 (선택적)
 * @returns `rank`를 설정한 `ResultContext.Provider`로 감싼 React 요소
 */
export function ResultProvider({ children, rank }: ResultProviderProps) {
  return (
    <ResultContext.Provider value={{ rank }}>{children}</ResultContext.Provider>
  );
}

/**
 * 현재 컴포넌트 트리에서 ResultContext의 값을 제공한다.
 *
 * @returns 현재 컨텍스트 값 (`ResultContextValue`)
 *
 * @throws `Error` - 함수가 `ResultProvider` 내부가 아닌 곳에서 호출된 경우
 */
export function useResult() {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
}