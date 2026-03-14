import { Calendar, Clock } from "lucide-react";
import { TicketPlatform } from "@/types/performance";
import { formatDateTime } from "@/lib/utils";
import { PLATFORM_DISPLAY_NAME } from "@/constants/performance";
import Image from "next/image";
import Mounted from "@/components/ui/common/Mounted";

interface TicketingPreviewCardProps {
  platform: TicketPlatform;
  performanceName: string;
  ticketingDate: string;
  simulationDate?: string;
  posterUrl: string | null;
}

export function TicketingPreviewCard(props: TicketingPreviewCardProps) {
  return (
    <div className="group">
      {/* 포스터 */}
      <div>
        <div className="aspect-3/4 bg-linear-to-br from-purple-200 via-pink-200 to-orange-200 relative overflow-hidden">
          {props.posterUrl ? (
            <Image
              src={props.posterUrl}
              alt={props.performanceName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Calendar className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
              {PLATFORM_DISPLAY_NAME[props.platform]}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h4 className="mb-2 line-clamp-2 min-h-12 group-hover:text-purple-600 transition-colors">
          {props.performanceName}
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
            <Mounted fallback={<div className="min-h-5">시간 계산 중..</div>}>
              <div className="min-h-5">{formatDateTime(props.ticketingDate)}</div>
            </Mounted>
          </div>

          {/* 공연장 이름 출력 X */}
          {/* <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{props.venueName}</div>
          </div> */}

          {/* 현재 지원하지 않는 값이므로 조건문 처리 */}
          {props.simulationDate && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-purple-600">
                <Clock className="w-4 h-4 shrink-0" />
                <Mounted
                  fallback={<div className="text-xs min-h-4">시간 계산 중..</div>}
                >
                  <div className="text-xs min-h-4">
                    모의 티켓팅: {formatDateTime(props.simulationDate)}
                  </div>
                </Mounted>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
