import { SiteCongestion } from '@/types/traffic';
import { CONGESTION_LEVELS } from './trafficConfig';

interface Props {
  sites: SiteCongestion[];
}

export function TrafficSummaryCards({ sites }: Props) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {sites.map((site) => {
        const levelConfig = CONGESTION_LEVELS[site.currentLevel];

        return (
          <div
            key={site.site}
            className={`${site.backgroundColor} rounded-lg p-3 border ${site.borderColor}`}
          >
            <div className={`text-xs ${site.textColor} mb-1`}>
              {site.displayName}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-semibold">
                {site.currentCongestionScore.toFixed(0)}점
              </div>
              <div
                className={`text-xs px-2 py-0.5 rounded-full ${levelConfig.bgColor} ${levelConfig.textColor} font-medium`}
              >
                {levelConfig.label}
              </div>
            </div>
            <div className="text-xs text-gray-500">예매 경쟁 강도</div>
          </div>
        );
      })}
    </div>
  );
}
