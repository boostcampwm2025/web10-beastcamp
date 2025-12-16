import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: number;
  nickname: string;
  message: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  { id: 1, nickname: '티켓마스터', message: '첫 시도인데 긴장되네요!', timestamp: '12:34' },
  { id: 2, nickname: '콘서트러버', message: '대기열 통과 꿀팁 있나요?', timestamp: '12:35' },
  { id: 3, nickname: '예매왕', message: '보안문자 연습 많이 하세요~', timestamp: '12:36' },
];

export function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        '성공했어요! 연습 덕분에 실전도 성공!',
        '네트워크 상태 체크 진짜 중요하네요',
        '이번 시뮬레이션 난이도 높았어요',
        '좌석 선택이 제일 어려웠어요',
        '실전처럼 긴장되네요 ㅋㅋ',
      ];
      const randomNicknames = ['티켓헌터', '공연매니아', '연습생', '예매고수', '티켓왕'];
      
      const newMessage: ChatMessage = {
        id: Date.now(),
        nickname: randomNicknames[Math.floor(Math.random() * randomNicknames.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev.slice(-20), newMessage]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSetNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setIsNicknameSet(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isNicknameSet) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        nickname: nickname,
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg">실시간 채팅</h3>
            <p className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              {messages.length}명 참여 중
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-purple-600">{msg.nickname}</span>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 inline-block max-w-[80%]">
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {!isNicknameSet ? (
          <form onSubmit={handleSetNickname} className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={20}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              확인
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
