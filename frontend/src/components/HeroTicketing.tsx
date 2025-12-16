import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface HeroTicketingProps {
  onStartSimulation: () => void;
}

export function HeroTicketing({ onStartSimulation }: HeroTicketingProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          setIsActive(true);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '상': return 'bg-red-100 text-red-700';
      case '중': return 'bg-yellow-100 text-yellow-700';
      case '하': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span className="text-sm">다음 티켓팅</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl mb-4">
            2025 아이유 콘서트 &lt;HEREH&gt;
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-white/80" />
              <span>2025년 10월 11일 저녁 8시</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-white/80" />
              <span>서울 잠실 종합운동장</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-white/80" />
              <span>99,000원 ~ 154,000원</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
              콘서트
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
              인터파크
            </span>
            <span className={`${getDifficultyColor('상')} px-3 py-1 rounded-lg text-sm flex items-center gap-1`}>
              <TrendingUp className="w-4 h-4" />
              난이도: 상
            </span>
          </div>
        </div>

        {/* Right Side - Countdown & Button */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <span className="text-sm text-white/80">티켓팅 시작까지</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: '일', value: timeLeft.days },
                { label: '시간', value: timeLeft.hours },
                { label: '분', value: timeLeft.minutes },
                { label: '초', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl md:text-3xl">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white/70 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onStartSimulation}
            disabled={!isActive}
            className={`w-full py-4 rounded-xl transition-all ${
              isActive
                ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                : 'bg-white/30 text-white/50 cursor-not-allowed'
            }`}
          >
            {isActive ? '예매하기' : '대기 중...'}
          </button>

          {!isActive && (
            <p className="text-center text-sm text-white/60 mt-3">
              티켓팅 시작 시간에 활성화됩니다
            </p>
          )}

          {/* Demo button for testing */}
          <button
            onClick={onStartSimulation}
            className="w-full mt-3 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm border border-white/30"
          >
            데모 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
