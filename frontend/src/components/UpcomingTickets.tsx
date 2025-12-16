import { Calendar, MapPin, Clock } from 'lucide-react';

const upcomingTickets = [
  {
    id: 1,
    title: '2025 BTS 월드투어 앙코르',
    date: '2025.11.15',
    time: '20:00',
    simulationDate: '2025.10.20 14:00',
    venue: '고척 스카이돔',
    provider: '인터파크',
    poster: 'concert performance'
  },
  {
    id: 2,
    title: '뮤지컬 <레미제라블>',
    date: '2025.12.01',
    time: '19:30',
    simulationDate: '2025.10.25 12:00',
    venue: '블루스퀘어',
    provider: 'YES24',
    poster: 'musical theater'
  },
  {
    id: 3,
    title: '2025 세븐틴 콘서트',
    date: '2025.11.30',
    time: '18:00',
    simulationDate: '2025.10.28 15:00',
    venue: '잠실 실내체육관',
    provider: '멜론티켓',
    poster: 'concert kpop'
  },
  {
    id: 4,
    title: '뮤지컬 <위키드>',
    date: '2025.12.10',
    time: '20:00',
    simulationDate: '2025.11.01 10:00',
    venue: '샤롯데씨어터',
    provider: 'YES24',
    poster: 'musical stage'
  },
  {
    id: 5,
    title: '2025 NewJeans 팬미팅',
    date: '2025.12.20',
    time: '19:00',
    simulationDate: '2025.11.05 14:00',
    venue: '올림픽공원 체조경기장',
    provider: '인터파크',
    poster: 'concert fanmeeting'
  }
];

export function UpcomingTickets() {
  return (
    <div className="mt-8">
      <div className="mb-6">
        <h3 className="text-2xl mb-2">다가오는 티켓팅 일정</h3>
        <p className="text-gray-500">예정된 모의 티켓팅 목록입니다</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {upcomingTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-purple-200 group cursor-pointer"
          >
            {/* Poster */}
            <div className="aspect-[3/4] bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Calendar className="w-12 h-12" />
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  {ticket.provider}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="mb-3 line-clamp-2 min-h-[3rem] group-hover:text-purple-600 transition-colors">
                {ticket.title}
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{ticket.date} {ticket.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>{ticket.venue}</div>
                </div>

                <div className="pt-2 mt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <div className="text-xs">
                      모의 티켓팅: {ticket.simulationDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
