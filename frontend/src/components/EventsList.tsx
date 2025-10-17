/**
 * A React component that renders a list of events. If no events are provided, 
 * it displays a placeholder message indicating that there are no entries to show.
 *
 * @component
 * @param {EventsListProps} props - The props for the EventsList component.
 * @param {Event[]} props.events - An array of event objects to be displayed.
 * @param {(event: Event) => void} props.onViewEvent - Callback function triggered when an event is viewed.
 * @param {(event: Event) => void} props.onEditEvent - Callback function triggered when an event is edited.
 * @param {(event: Event) => void} props.onDeleteEvent - Callback function triggered when an event is deleted.
 *
 * @returns {JSX.Element} A card component containing the list of events or a placeholder message.
 *
 * @example
 * ```tsx
 * const events = [
 *   {
 *     ID: 1,
 *     Reported_Time: new Date(),
 *     Settlement: "Budapest",
 *     Street: "Main Street",
 *     House_Number: 123,
 *     Desc: "Power outage",
 *     Response: "Technician dispatched",
 *     Failure_Type: "Electrical",
 *     Worker_Name: "John Doe",
 *     HandOver_Time: new Date(),
 *   },
 * ];
 *
 * const handleViewEvent = (event: Event) => {
 *   console.log("View event:", event);
 * };
 *
 * const handleEditEvent = (event: Event) => {
 *   console.log("Edit event:", event);
 * };
 *
 * const handleDeleteEvent = (event: Event) => {
 *   console.log("Delete event:", event);
 * };
 *
 * <EventsList
 *   events={events}
 *   onViewEvent={handleViewEvent}
 *   onEditEvent={handleEditEvent}
 *   onDeleteEvent={handleDeleteEvent}
 * />;
 * ```
 */

import { Book} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCard from './EventCard';

interface Event {
  ID: number;
  Reported_Time: Date;
  Settlement: string;
  Street: string;
  House_Number: number;
  Desc: string;
  Response: string;
  Failure_Type: string;
  Worker_Name: string;
  HandOver_Time: Date;
}

interface EventsListProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

const EventsList = ({ events,onViewEvent, onEditEvent, onDeleteEvent }: EventsListProps) => {

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Bejegyzések</CardTitle>
      </CardHeader>
      <CardContent>
        {!events || events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Nincsenek megjeleníthető bejegyzések</p>
            
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.ID}
                event={event}
                onView={onViewEvent}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
