/**
 * Represents an event card component that displays details about an event.
 * 
 * @component
 * @param {EventCardProps} props - The properties for the EventCard component.
 * @param {Event} props.event - The event object containing details to display.
 * @param {(event: Event) => void} props.onView - Callback function triggered when the card is clicked to view the event.
 * @param {(event: Event) => void} props.onEdit - Callback function triggered when the edit button is clicked.
 * @param {(event: Event) => void} props.onDelete - Callback function triggered when the delete button is clicked.
 * 
 * @returns {JSX.Element} A styled card displaying event details, with optional admin controls for editing and deleting.
 * 
 * @remarks
 * - The component uses the `useUserData` hook to determine if the user is an admin.
 * - Admin users have access to both edit and delete buttons, while non-admin users only see the edit button.
 * - The card displays event details such as failure type, reported time, location, and response status.
 * - The `timedesing` and `datedesing` helper functions format the reported time and date for display.
 * 
 * @example
 * ```tsx
 * const event = {
 *   ID: 1,
 *   Reported_Time: new Date(),
 *   Settlement: "Budapest",
 *   Street: "Main Street",
 *   House_Number: 123,
 *   Desc: "Power outage",
 *   Response: "Nyitott",
 *   Failure_Type: "Electrical",
 *   Worker_Name: "John Doe",
 *   HandOver_Time: new Date(),
 * };
 * 
 * <EventCard
 *   event={event}
 *   onView={(e) => console.log("View event", e)}
 *   onEdit={(e) => console.log("Edit event", e)}
 *   onDelete={(e) => console.log("Delete event", e)}
 * />
 * ```
 */

import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useUserData } from '@/components/UserContext';


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

interface EventCardProps {
  event: Event;
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const EventCard = ({ event, onView, onEdit, onDelete }: EventCardProps) => {
  const { is_admin } = useUserData() || {};

  function timedesing(event) {
    const hour = event.Reported_Time.getHours().toString().padStart(2, "0");
    const minute = event.Reported_Time.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }
  
  function datedesing(event) {
    const month = (event.Reported_Time.getMonth() + 1).toString().padStart(2, "0");
    const day = event.Reported_Time.getDate().toString().padStart(2, "0");
    return `${month}.${day}`;
  }
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      onClick={() => {
        onView(event);
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{event.Failure_Type}</h2>
          {/* <h2 className="text-lg font-semibold text-gray-900">#{event.ID}</h2> */}
          <div className="flex gap-20 mt-2 text-sm text-gray-1000">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" ></Calendar>
                <p className="font-medium">Bejelentés ideje:</p>
                {event.Reported_Time.getFullYear()}.{datedesing(event)} {timedesing(event)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <p className="font-medium">Lokáció: </p>
                {event.Settlement} {event.Street} {event.House_Number}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4"/>
              <p className="font-medium">Állapot:</p>
                {event.Response === "Lezárt" && (<span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                {event.Response}
                </span>)}
                {event.Response === "Nyitott" && (<span className="px-3 py-1 text-sm rounded-full bg-red-100 text-gray-700">
                  {event.Response}
                </span>)}
                {event.Response === "Folyamatban" && (<span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  {event.Response}
                </span>)}
            </div>
          </div>
        </div>
        {is_admin === 1 ? (
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event);
              }}
              className="hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default EventCard;
