import { useState } from "react";
import { HeroTicketing } from "./components/HeroTicketing";
import { UpcomingTickets } from "./components/UpcomingTickets";
import { NetworkStatus } from "./components/NetworkStatus";
import { LiveChat } from "./components/LiveChat";
import { TicketingTips } from "./components/TicketingTips";
import { TrafficChart } from "./components/TrafficChart";
import { TicketingAwards } from "./components/TicketingAwards";
import { TicketingSimulation } from "./components/TicketingSimulation";
import { Ticket } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">티켓팅 시뮬레이터</h1>
                <p className="text-sm text-gray-500">실전처럼 연습하세요</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <HeroTicketing onStartSimulation={() => setIsSimulationOpen(true)} />

          {/* Network Status */}
          <NetworkStatus />

          {/* Upcoming Tickets */}
          <UpcomingTickets />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Traffic Chart */}
            <TrafficChart />

            {/* Live Chat */}
            <LiveChat />
          </div>

          {/* Ticketing Awards */}
          <TicketingAwards />

          {/* Ticketing Tips */}
          <TicketingTips />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 티켓팅 시뮬레이터. 모의 연습 서비스입니다.
            </p>
          </div>
        </footer>

        {/* Simulation Modal */}
        {isSimulationOpen && (
          <TicketingSimulation onClose={() => setIsSimulationOpen(false)} />
        )}
      </div>
    </QueryClientProvider>
  );
}
