// app/page.tsx
/**
 * Home page (/)
 * Resources: app/_source/
 */

import dynamicImport from "next/dynamic";
import ExperienceCleanup from "./experience/demoTicketing/ExperienceCleanup";

import NetworkStatus from "./_source/components/network/NetworkStatus";
import { ScheduledTicketings } from "./_source/components/scheduledTicketing/ScheduledTicketings";
import UpcomingTicketing from "./_source/components/ticketing/UpcomingTicketing";

const Chat = dynamicImport(() => import("./_source/components/chat/Chat"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  ),
});

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <UpcomingTicketing />
      <NetworkStatus />
      <Chat />
      <ScheduledTicketings />
      <ExperienceCleanup />
    </main>
  );
}
