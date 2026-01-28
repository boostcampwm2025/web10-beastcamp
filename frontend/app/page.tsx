// app/page.tsx
/**
 * Home page (/)
 * Resources: app/_source/
 */

import NetworkStatus from "./_source/components/network/NetworkStatus";
import { ScheduledTicketings } from "./_source/components/scheduledTicketing/ScheduledTicketings";
import UpcomingTicketing from "./_source/components/ticketing/UpcomingTicketing";
export const dynamic = "force-dynamic";

/**
 * Render the home page composed of upcoming ticketing, network status, and scheduled ticketings.
 *
 * @returns The page's JSX element containing UpcomingTicketing, NetworkStatus, and ScheduledTicketings components.
 */
export default async function Home() {
  return (
    <>
      <UpcomingTicketing />
      <NetworkStatus />
      <ScheduledTicketings />
    </>
  );
}