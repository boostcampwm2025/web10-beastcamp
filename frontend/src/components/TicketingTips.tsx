import { Lightbulb, CheckCircle2 } from 'lucide-react';

const tips = [
  {
    category: '취소표 줍는 법',
    items: [
      '공연 2-3일 전, 당일 오전 10시-12시가 취소표가 많이 나오는 시간',
      '티켓팅 시작 후 15분, 30분, 1시간 단위로 재확인',
      '결제 대기 시간 초과로 인한 자동 취소 시간대를 노려보세요',
      '새벽 시간대(2-4시)에도 의외로 취소표가 나올 수 있습니다'
    ]
  },
  {
    category: '성공률 높이는 법',
    items: [
      '티켓팅 시작 5분 전부터 로그인 상태를 유지하세요',
      '결제 수단(카드번호, CVC)을 미리 메모해두세요',
      '유선 인터넷(LAN)이 와이파이보다 안정적입니다',
      '팝업 차단을 해제하고 쿠키를 허용하세요',
      '보안문자 연습을 충분히 해두세요',
      '여러 탭을 열지 말고 하나의 창에서 집중하세요'
    ]
  },
  {
    category: '네트워크 최적화',
    items: [
      'VPN은 오히려 속도를 느리게 할 수 있으니 끄세요',
      '다른 프로그램과 다운로드를 모두 종료하세요',
      '가족이 같은 네트워크를 사용 중이라면 양해를 구하세요',
      'PC보다 모바일이 더 빠를 수 있으니 둘 다 준비하세요'
    ]
  }
];

export function TicketingTips() {
  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl">티켓팅 꿀팁</h3>
            <p className="text-gray-500">성공률을 높이는 실전 노하우</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tipSection, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h4 className="text-lg mb-4 pb-3 border-b border-gray-100">
              {tipSection.category}
            </h4>
            <ul className="space-y-3">
              {tipSection.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
