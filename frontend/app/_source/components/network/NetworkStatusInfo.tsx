/**
 * Renders a compact informational notice advising that a stable network is required to improve ticketing success rates.
 *
 * @returns A JSX element: a styled div containing three inline spans that together display the message in Korean.
 */
export default function NetworkStatusInfo() {
  return (
    <div className="bg-white p-1.5 font-light rounded-sm mt-3 text-sm ">
      <span className="text-black">💡 티켓팅 성공률을 높이려면</span>
      <span> 안정적인 네트워크 환경</span>
      <span className="text-black">이 필수입니다.</span>
    </div>
  );
}