// app/page.tsx
/**
 * Home page (/)
 * Resources: app/_source/
 */

import UpcomingTicketing from './_source/components/ticketing/UpcomingTicketing';
import { TrafficChart } from './_source/components/TrafficChart';
export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <UpcomingTicketing />
      <TrafficChart />
    </main>
  );
}
