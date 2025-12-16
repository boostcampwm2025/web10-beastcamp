import { Trophy, TrendingUp, Award } from 'lucide-react';

const rankings = [
  {
    rank: 1,
    provider: '인터파크',
    event: 'BTS 월드투어 2024',
    traffic: '2,450,000',
    date: '2024.09.15',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    rank: 2,
    provider: 'YES24',
    event: '뮤지컬 <오페라의 유령>',
    traffic: '1,850,000',
    date: '2024.08.20',
    color: 'from-gray-400 to-gray-500'
  },
  {
    rank: 3,
    provider: '멜론티켓',
    event: '아이유 콘서트 2024',
    traffic: '1,650,000',
    date: '2024.07.10',
    color: 'from-orange-600 to-orange-700'
  },
  {
    rank: 4,
    provider: '인터파크',
    event: '임영웅 전국투어',
    traffic: '1,420,000',
    date: '2024.06.05',
    color: 'from-purple-500 to-purple-600'
  },
  {
    rank: 5,
    provider: 'YES24',
    event: '뮤지컬 <레미제라블>',
    traffic: '1,280,000',
    date: '2024.05.18',
    color: 'from-blue-500 to-blue-600'
  }
];

export function TicketingAwards() {
  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl">티켓팅 어워즈</h3>
            <p className="text-gray-500">역대 최고 트래픽 기록 TOP 5</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">제공사</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">공연명</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">최대 트래픽</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">기록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rankings.map((item) => (
                <tr 
                  key={item.rank}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.rank <= 3 ? (
                        <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                          {item.rank === 1 ? (
                            <Trophy className="w-4 h-4 text-white" />
                          ) : item.rank === 2 ? (
                            <Award className="w-4 h-4 text-white" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-600">{item.rank}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                      {item.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span>{item.event}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">{item.traffic}명</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">{item.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
