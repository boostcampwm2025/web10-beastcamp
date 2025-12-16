import { useState, useEffect } from 'react';
import { X, Clock, Users, Shield, Armchair, Trophy, CheckCircle, ArrowLeft, ChevronLeft } from 'lucide-react';

interface TicketingSimulationProps {
  onClose: () => void;
}

type Step = 'queue' | 'seats' | 'result';
type SeatGrade = 'VIP' | 'R' | 'S' | 'A' | 'GENERAL';

interface Zone {
  id: string;
  name: string;
  grade: SeatGrade;
  price: number;
  available: number;
  color: string;
}

interface SelectedSeat {
  zone: string;
  seatNumber: number;
  grade: SeatGrade;
  price: number;
}

const zones: Zone[] = [
  { id: 'zone-vip-1', name: 'VIP 1구역', grade: 'VIP', price: 154000, available: 45, color: 'bg-purple-600' },
  { id: 'zone-vip-2', name: 'VIP 2구역', grade: 'VIP', price: 154000, available: 38, color: 'bg-purple-600' },
  { id: 'zone-r-1', name: 'R 1구역', grade: 'R', price: 143000, available: 62, color: 'bg-pink-500' },
  { id: 'zone-r-2', name: 'R 2구역', grade: 'R', price: 143000, available: 58, color: 'bg-pink-500' },
  { id: 'zone-s-1', name: 'S 1구역', grade: 'S', price: 132000, available: 89, color: 'bg-blue-500' },
  { id: 'zone-s-2', name: 'S 2구역', grade: 'S', price: 132000, available: 91, color: 'bg-blue-500' },
  { id: 'zone-a-1', name: 'A 1구역', grade: 'A', price: 110000, available: 124, color: 'bg-green-500' },
  { id: 'zone-a-2', name: 'A 2구역', grade: 'A', price: 110000, available: 118, color: 'bg-green-500' },
  { id: 'zone-gen-1', name: '일반석 1구역', grade: 'GENERAL', price: 99000, available: 156, color: 'bg-gray-500' },
  { id: 'zone-gen-2', name: '일반석 2구역', grade: 'GENERAL', price: 99000, available: 148, color: 'bg-gray-500' },
];

const gradeInfo = {
  VIP: { name: 'VIP석', price: 154000, color: 'bg-purple-600', textColor: 'text-purple-600', bgColor: 'bg-purple-100' },
  R: { name: 'R석', price: 143000, color: 'bg-pink-500', textColor: 'text-pink-600', bgColor: 'bg-pink-100' },
  S: { name: 'S석', price: 132000, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-100' },
  A: { name: 'A석', price: 110000, color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-100' },
  GENERAL: { name: '일반석', price: 99000, color: 'bg-gray-500', textColor: 'text-gray-600', bgColor: 'bg-gray-100' },
};

export function TicketingSimulation({ onClose }: TicketingSimulationProps) {
  const [step, setStep] = useState<Step>('queue');
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [queuePosition, setQueuePosition] = useState(15234);
  const [totalQueue, setTotalQueue] = useState(45678);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode] = useState('A7K9M2');
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [timeLog, setTimeLog] = useState<{ [key: string]: number }>({});
  const [stepStartTime, setStepStartTime] = useState(Date.now());

  // Queue simulation
  useEffect(() => {
    if (step === 'queue') {
      setStepStartTime(Date.now());
      const interval = setInterval(() => {
        setQueuePosition(prev => {
          const newPos = prev - Math.floor(Math.random() * 500) - 200;
          if (newPos <= 0) {
            clearInterval(interval);
            const timeSpent = (Date.now() - stepStartTime) / 1000;
            setTimeLog(prev => ({ ...prev, queue: timeSpent }));
            setTimeout(() => {
              setStep('seats');
              setShowCaptchaModal(true);
              setStepStartTime(Date.now());
            }, 500);
            return 0;
          }
          return newPos;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step, stepStartTime]);

  const handleCaptchaSubmit = () => {
    const timeSpent = (Date.now() - stepStartTime) / 1000;
    setTimeLog(prev => ({ ...prev, captcha: timeSpent }));
    
    if (captchaInput.toUpperCase() === captchaCode) {
      setShowCaptchaModal(false);
      setStepStartTime(Date.now());
    } else {
      alert('보안문자가 일치하지 않습니다. 다시 시도해주세요.');
      setCaptchaInput('');
    }
  };

  const handleSeatSelection = (seatNumber: number) => {
    if (!selectedZone) return;

    const existingIndex = selectedSeats.findIndex(
      s => s.zone === selectedZone.id && s.seatNumber === seatNumber
    );

    if (existingIndex >= 0) {
      setSelectedSeats(selectedSeats.filter((_, i) => i !== existingIndex));
    } else if (selectedSeats.length < 2) {
      setSelectedSeats([
        ...selectedSeats,
        {
          zone: selectedZone.id,
          seatNumber,
          grade: selectedZone.grade,
          price: selectedZone.price,
        },
      ]);
    }
  };

  const handleConfirmSeats = () => {
    const timeSpent = (Date.now() - stepStartTime) / 1000;
    setTimeLog(prev => ({ ...prev, seats: timeSpent }));
    setStep('result');
  };

  const totalTime = Object.values(timeLog).reduce((a, b) => a + b, 0);
  const userRank = Math.floor(Math.random() * 1000) + 1;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Queue Step - Modal Style */}
      {step === 'queue' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-2">대기열 진행 중</h3>
              <p className="text-gray-500 mb-8">잠시만 기다려주세요...</p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${((totalQueue - queuePosition) / totalQueue) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-8">
                  <span>대기 순서: {queuePosition.toLocaleString()}명</span>
                  <span>전체: {totalQueue.toLocaleString()}명</span>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-gray-600">
                    💡 실제 티켓팅처럼 긴장감 있게 대기 중입니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seats Step - Full Page */}
      {step === 'seats' && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl">2025 아이유 콘서트 &lt;HEREH&gt;</h2>
                    <p className="text-sm text-gray-500">2025년 10월 11일 저녁 8시 · 서울 잠실 종합운동장</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">선택: {selectedSeats.length}/2석</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Seat Map */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  {/* Zone Selection View */}
                  {!selectedZone ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-xl mb-2">구역 선택</h3>
                        <p className="text-sm text-gray-500">원하는 구역을 선택해주세요</p>
                      </div>

                      {/* Grade Legend */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(gradeInfo).map(([key, info]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${info.color}`}></div>
                              <div>
                                <div className="text-sm">{info.name}</div>
                                <div className="text-xs text-gray-500">{info.price.toLocaleString()}원</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Stage */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-4 rounded-lg mb-8 shadow-lg">
                        <div className="text-lg">🎤 STAGE 🎤</div>
                      </div>

                      {/* Zone Map */}
                      <div className="relative">
                        <svg viewBox="0 0 800 600" className="w-full h-auto">
                          {/* VIP Zones - Front Center */}
                          <g onClick={() => setSelectedZone(zones[0])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="280" y="120" width="100" height="80" className="fill-purple-600" rx="8" />
                            <text x="330" y="155" textAnchor="middle" className="fill-white text-sm">VIP 1구역</text>
                            <text x="330" y="175" textAnchor="middle" className="fill-white text-xs">{zones[0].available}석</text>
                          </g>
                          <g onClick={() => setSelectedZone(zones[1])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="420" y="120" width="100" height="80" className="fill-purple-600" rx="8" />
                            <text x="470" y="155" textAnchor="middle" className="fill-white text-sm">VIP 2구역</text>
                            <text x="470" y="175" textAnchor="middle" className="fill-white text-xs">{zones[1].available}석</text>
                          </g>

                          {/* R Zones - Middle */}
                          <g onClick={() => setSelectedZone(zones[2])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="150" y="220" width="100" height="100" className="fill-pink-500" rx="8" />
                            <text x="200" y="265" textAnchor="middle" className="fill-white text-sm">R 1구역</text>
                            <text x="200" y="285" textAnchor="middle" className="fill-white text-xs">{zones[2].available}석</text>
                          </g>
                          <g onClick={() => setSelectedZone(zones[3])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="550" y="220" width="100" height="100" className="fill-pink-500" rx="8" />
                            <text x="600" y="265" textAnchor="middle" className="fill-white text-sm">R 2구역</text>
                            <text x="600" y="285" textAnchor="middle" className="fill-white text-xs">{zones[3].available}석</text>
                          </g>

                          {/* S Zones */}
                          <g onClick={() => setSelectedZone(zones[4])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="280" y="220" width="100" height="120" className="fill-blue-500" rx="8" />
                            <text x="330" y="275" textAnchor="middle" className="fill-white text-sm">S 1구역</text>
                            <text x="330" y="295" textAnchor="middle" className="fill-white text-xs">{zones[4].available}석</text>
                          </g>
                          <g onClick={() => setSelectedZone(zones[5])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="420" y="220" width="100" height="120" className="fill-blue-500" rx="8" />
                            <text x="470" y="275" textAnchor="middle" className="fill-white text-sm">S 2구역</text>
                            <text x="470" y="295" textAnchor="middle" className="fill-white text-xs">{zones[5].available}석</text>
                          </g>

                          {/* A Zones */}
                          <g onClick={() => setSelectedZone(zones[6])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="150" y="340" width="100" height="120" className="fill-green-500" rx="8" />
                            <text x="200" y="395" textAnchor="middle" className="fill-white text-sm">A 1구역</text>
                            <text x="200" y="415" textAnchor="middle" className="fill-white text-xs">{zones[6].available}석</text>
                          </g>
                          <g onClick={() => setSelectedZone(zones[7])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="550" y="340" width="100" height="120" className="fill-green-500" rx="8" />
                            <text x="600" y="395" textAnchor="middle" className="fill-white text-sm">A 2구역</text>
                            <text x="600" y="415" textAnchor="middle" className="fill-white text-xs">{zones[7].available}석</text>
                          </g>

                          {/* General Zones - Back */}
                          <g onClick={() => setSelectedZone(zones[8])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="280" y="360" width="100" height="140" className="fill-gray-500" rx="8" />
                            <text x="330" y="420" textAnchor="middle" className="fill-white text-sm">일반석</text>
                            <text x="330" y="440" textAnchor="middle" className="fill-white text-sm">1구역</text>
                            <text x="330" y="460" textAnchor="middle" className="fill-white text-xs">{zones[8].available}석</text>
                          </g>
                          <g onClick={() => setSelectedZone(zones[9])} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <rect x="420" y="360" width="100" height="140" className="fill-gray-500" rx="8" />
                            <text x="470" y="420" textAnchor="middle" className="fill-white text-sm">일반석</text>
                            <text x="470" y="440" textAnchor="middle" className="fill-white text-sm">2구역</text>
                            <text x="470" y="460" textAnchor="middle" className="fill-white text-xs">{zones[9].available}석</text>
                          </g>
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Seat Selection View */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedZone(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div>
                            <h3 className="text-xl">{selectedZone.name}</h3>
                            <p className="text-sm text-gray-500">
                              {gradeInfo[selectedZone.grade].name} · {selectedZone.price.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg ${gradeInfo[selectedZone.grade].color} text-white text-sm`}>
                          잔여 {selectedZone.available}석
                        </div>
                      </div>

                      {/* Seats Grid */}
                      <div className="mb-8">
                        <div className="grid grid-cols-10 gap-2 mb-6">
                          {Array.from({ length: 100 }, (_, i) => {
                            const isSelected = selectedSeats.some(
                              s => s.zone === selectedZone.id && s.seatNumber === i
                            );
                            const isOccupied = Math.random() > 0.65;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => !isOccupied && handleSeatSelection(i)}
                                disabled={isOccupied}
                                className={`aspect-square rounded transition-all text-xs ${
                                  isSelected
                                    ? `${gradeInfo[selectedZone.grade].color} text-white scale-110 shadow-lg`
                                    : isOccupied
                                    ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                                    : `${gradeInfo[selectedZone.grade].bgColor} hover:${gradeInfo[selectedZone.grade].color} hover:text-white ${gradeInfo[selectedZone.grade].textColor} hover:scale-105`
                                }`}
                              >
                                {isOccupied ? '✕' : i + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex gap-6 justify-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded border ${gradeInfo[selectedZone.grade].bgColor} border-gray-300`}></div>
                            <span className="text-gray-600">선택가능</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded ${gradeInfo[selectedZone.grade].color}`}></div>
                            <span className="text-gray-600">선택됨</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded"></div>
                            <span className="text-gray-600">예매완료</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                  <h3 className="text-lg mb-4">선택 정보</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">공연일</span>
                      <span>2025.10.11</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">시간</span>
                      <span>20:00</span>
                    </div>
                    
                    {selectedSeats.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-sm text-gray-600 mb-2">선택 좌석</div>
                        <div className="space-y-2">
                          {selectedSeats.map((seat, index) => {
                            const zone = zones.find(z => z.id === seat.zone);
                            return (
                              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                <span>{zone?.name} {seat.seatNumber + 1}번</span>
                                <span className={gradeInfo[seat.grade].textColor}>
                                  {seat.price.toLocaleString()}원
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="text-gray-600">매수</span>
                      <span>{selectedSeats.length}매</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 금액</span>
                      <span className="text-xl text-purple-600">
                        {totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmSeats}
                    disabled={selectedSeats.length === 0}
                    className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    예매하기
                  </button>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      ⏰ 좌석 선택 후 5분 이내에 결제를 완료해주세요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Captcha Modal Overlay */}
      {showCaptchaModal && step === 'seats' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl mb-2 text-center">보안문자 입력</h3>
            <p className="text-gray-500 mb-8 text-center">아래 문자를 정확히 입력해주세요</p>

            <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
              <div className="text-4xl tracking-widest select-none" style={{ 
                fontFamily: 'monospace',
                textDecoration: 'line-through wavy',
                textDecorationColor: '#e5e7eb'
              }}>
                {captchaCode}
              </div>
            </div>

            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCaptchaSubmit()}
              placeholder="보안문자 입력"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-center text-lg tracking-widest"
              maxLength={6}
              autoFocus
            />

            <button
              onClick={handleCaptchaSubmit}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              확인
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 힌트: 보안문자는 대소문자를 구분하지 않습니다
            </p>
          </div>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
            <div className="py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-2 text-center">예매 완료!</h3>
              <p className="text-gray-500 mb-8 text-center">티켓팅 결과를 확인하세요</p>

              <div className="max-w-md mx-auto space-y-4">
                {/* Success Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-800">성공적으로 티켓을 예매했습니다!</p>
                </div>

                {/* Time Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    단계별 소요 시간
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">대기열 통과</span>
                      <span>{timeLog.queue?.toFixed(1)}초</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">보안문자 입력</span>
                      <span>{timeLog.captcha?.toFixed(1)}초</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">좌석 선택</span>
                      <span>{timeLog.seats?.toFixed(1)}초</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span>총 소요 시간</span>
                      <span className="text-purple-600">{totalTime.toFixed(1)}초</span>
                    </div>
                  </div>
                </div>

                {/* Rank */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
                  <p className="text-gray-600 mb-2">전체 사용자 중</p>
                  <p className="text-3xl text-purple-600 mb-2">{userRank}위</p>
                  <p className="text-sm text-gray-500">상위 {((userRank / 10000) * 100).toFixed(1)}%</p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}