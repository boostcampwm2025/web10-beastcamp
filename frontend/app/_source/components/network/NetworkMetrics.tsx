interface NetworkMetricsProps {
  pings: { name: string; latency: number | null }[];
  bandwidth: number | null;
}

/**
 * Render a 4-column grid of network metrics showing per-target latency and overall bandwidth.
 *
 * @param pings - Array of ping entries to display; each entry's latency is shown rounded to the nearest millisecond as "`<n>ms`" or `"-"` when `null`.
 * @param bandwidth - Connection speed displayed as "`<n>Mbps`" or `"-"` when `null`.
 * @returns A React element containing a grid of cards for each ping and a final "Speed" card.
 */
export default function NetworkMetrics({
  pings,
  bandwidth,
}: NetworkMetricsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 text-xs opacity-80">
      {pings.map((ping) => (
        <div key={ping.name} className="rounded-lg p-3 bg-white">
          <span className="text-lg font-bold block mb-1">{ping.name}</span>
          <span className="font-mono text-base font-semibold">
            {ping.latency ? `${Math.round(ping.latency)}ms` : "-"}
          </span>
        </div>
      ))}
      <div className="rounded-lg p-3 flex flex-col justify-center bg-white">
        <span className="text-lg font-bold block mb-1">Speed</span>
        <span className="font-mono text-base font-semibold">
          {bandwidth ? `${bandwidth}Mbps` : "-"}
        </span>
      </div>
    </div>
  );
}