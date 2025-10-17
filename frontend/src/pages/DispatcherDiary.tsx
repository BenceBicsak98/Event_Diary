/**
 * DispatcherDiary Component
 *
 * This component represents the main page for managing and tracking events in the dispatcher diary.
 * It provides features for adding, editing, deleting, and viewing events, as well as filtering and querying events based on specific criteria.
 *
 * @component
 * @returns {JSX.Element} The rendered DispatcherDiary component.
 *
 * @description
 * - The component uses a sidebar layout for navigation and a main content area for managing events.
 * - Events can be added, edited, deleted, or viewed in detail using dialogs.
 * - Query filters allow users to filter events by date range and issue type.
 * - The component interacts with a backend API to fetch, add, update, and delete events.
 *
 * @state
 * - `fromDate` (string): The start date for filtering events.
 * - `toDate` (string): The end date for filtering events.
 * - `issueType` (string): The type of issue for filtering events.
 * - `events` (Event[]): The list of events displayed in the diary.
 * - `isAddEventOpen` (boolean): Controls the visibility of the "Add Event" dialog.
 * - `editingEvent` (Event | null): The event being edited.
 * - `isEditEventOpen` (boolean): Controls the visibility of the "Edit Event" dialog.
 * - `viewingEvent` (Event | null): The event being viewed.
 * - `isViewEventOpen` (boolean): Controls the visibility of the "View Event" dialog.
 * - `shouldShowQueryButton` (boolean): Determines whether the query button should be displayed.
 *
 * @dependencies
 * - React hooks: `useState`, `useEffect`
 * - Components: `Button`, `Dialog`, `EventForm`, `EventsList`, `QueryFilters`, `AppSidebar`, `ScrollTopFloating`
 * - Utilities: `toast` for notifications
 * - Context: `useUserData` for user information
 *
 * @functions
 * - `mapBackendEventToEvent(raw: RawEvent): Event`: Maps raw backend event data to the `Event` interface.
 * - `handleAddEvent(eventData: Event): void`: Handles adding a new event.
 * - `handleEditEvent(eventData: Event): void`: Handles editing an existing event.
 * - `handleDeleteEvent(eventData: Event): Promise<void>`: Handles deleting an event.
 * - `openEditDialog(event: Event): void`: Opens the "Edit Event" dialog for a specific event.
 * - `openViewDialog(event: Event): void`: Opens the "View Event" dialog for a specific event.
 * - `handleQuery(): void`: Executes a query to fetch events based on the selected filters.
 *
 * @interfaces
 * - `Event`: Represents an event with properties such as ID, reported time, settlement, etc.
 * - `RawEvent`: Represents the raw event data structure received from the backend.
 *
 * @example
 * ```tsx
 * <DispatcherDiary />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { Book, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { AppSidebar } from '@/components/AppSidebar';
import EventForm from '@/components/EventForm';
import EventsList from '@/components/EventsList';
import QueryFilters from '@/components/QueryFilters';
import { useUserData } from '@/components/UserContext';
import { ScrollTopFloating } from '@/components/ScrollButton';
import api from '@/api/client';

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

interface RawEvent {
  ID: number;
  REPORTED_TIME: string;
  SETTELMENT_NAME: string;
  STREET_NAME: string;
  HOUSE_NUMBER: string;
  DESCRIPTION: string;
  RESPONSE: string;
  FAILURE_TYPE: string;
  WORKER_NAME: string;
  HANDOVER_TIME: string;
}

const DispatcherDiary = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [issueType, setIssueType] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [shouldShowQueryButton, setShouldShowQueryButton] = useState(false);
  const { ID } = useUserData() || {};
  
  useEffect(() => {
    if (toDate < fromDate && fromDate != '' && toDate != '' && (issueType === '' || issueType === "none"|| issueType )) {
      setShouldShowQueryButton(false);
      toast({
        title: "Invalid Date Range",
        description: "The 'From' date cannot be later than the 'To' date.",
        variant: "destructive",
        duration: 3000
      });
  
    }
    if(issueType === "none"){
      setShouldShowQueryButton(false);
    }
    if (((fromDate && toDate && toDate > fromDate )) || (issueType !='' && issueType != 'none')) {
      setShouldShowQueryButton(true);
    }
  }, [fromDate, toDate, issueType]);

  function mapBackendEventToEvent(raw: RawEvent): Event {
    return {
      ID: raw.ID,
      Reported_Time: new Date(raw.REPORTED_TIME),
      Settlement: raw.SETTELMENT_NAME,
      Street: raw.STREET_NAME,
      House_Number: parseInt(raw.HOUSE_NUMBER),
      Desc: raw.DESCRIPTION,
      Response: raw.RESPONSE,
      Failure_Type: raw.FAILURE_TYPE,
      Worker_Name: raw.WORKER_NAME,
      HandOver_Time: new Date(raw.HANDOVER_TIME),
    };
  }
 
  const handleAddEvent = async (eventData: Event) => {
    const newEvent: Event = {
      ID: Date.now(),
      ...eventData,
      HandOver_Time: new Date()
    };

    try {
      const response = await api.post(`new_Event/${ID}`, {
        ID: 0,
        reported_time: new Date((new Date).getTime() - (new Date).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19),
        settlement_name: newEvent.Settlement,
        street_name: newEvent.Street,
        house_number: newEvent.House_Number,
        description: newEvent.Desc,
        response: newEvent.Response,
        failure_type: newEvent.Failure_Type,
        worker_name: newEvent.Worker_Name,
        handover_time: new Date((new Date).getTime() - (new Date).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19),
        },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Error from server side!");
      }
      setEvents((prev) => [...prev, newEvent]);
      setIsAddEventOpen(false);
      toast({
        title: "Event Added",
        description: "New event has been successfully added to the diary.",
        variant: "success",
        duration: 3000,
      });


    } catch (error) {
      console.error("❌ Issue during the request", error);
      toast({
        title: "Error",
        description: "Failed to add new event.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleEditEvent = async (eventData: Event) => {
    setEvents(prev => prev.map(event => 
      event.ID === editingEvent?.ID 
        ? { ...event, ...eventData }
        : event
    ));
    try{
      const response = await api.put(`update_Event/${ID}`, {
        ID: eventData.ID,
        reported_time: eventData.Reported_Time.toISOString(),
        settlement_name: eventData.Settlement,
        street_name: eventData.Street,
        house_number: eventData.House_Number,
        description: eventData.Desc,
        response: eventData.Response,
        failure_type: eventData.Failure_Type,
        worker_name: eventData.Worker_Name,
        handover_time: new Date((new Date).getTime() - (new Date).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19),
      },{ headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error("Error from server side!");
      }
      setIsEditEventOpen(false);
      setEditingEvent(null);
      toast({
        title: "Event Updated",
        description: "Event has been successfully updated.",
        variant: "success",
        duration: 3000
      });

    }catch (error){
      console.error("❌ Issue during the request:", error);
        toast({
          title: "Error",
          description: "Failed to update the event.",
          variant: "destructive",
          duration: 3000
        });
    }
  };

  const handleDeleteEvent = async (eventData: Event) => {
    setEvents(prev => prev.map(event => 
      event.ID === editingEvent?.ID 
        ? { ...event, ...eventData }
        : event
    ));
    try {
      const response = await api.delete(`delete_Event/${ID}`, {
        data: {
          ID: eventData.ID,
          reported_time: eventData.Reported_Time.toISOString(),
          settlement_name: eventData.Settlement,
          street_name: eventData.Street,
          house_number: eventData.House_Number,
          description: eventData.Desc,
          response: eventData.Response,
          failure_type: eventData.Failure_Type,
          worker_name: eventData.Worker_Name,
          handover_time: new Date((new Date).getTime() - (new Date).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 19),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error("Error from server side!");
      }
      setEvents(prev => prev.filter(event => event.ID !== eventData.ID));
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted from the diary.",
        variant: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("❌Issue during the request:", error);
      toast({
        title: "Error",
        description: "Failed to delete the event.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setIsEditEventOpen(true);
  };

  const openViewDialog = async (event: Event) => {
    setViewingEvent(event);
    setIsViewEventOpen(true);
  };

  const handleQuery = async () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toISOString().slice(0, 10) : '';
    const formattedToDate = toDate ? new Date(toDate).toISOString().slice(0, 10) : '';

    const formattedIssueType = issueType !="none" ? issueType : '';

    const params = {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      issueType: formattedIssueType,
      user_id: ID.toString() || ''
    };

    const queryParams = new URLSearchParams(params).toString();

    try{
      const response = await api.get(`/get_dispatcher_diary_EVENTS?${queryParams}`);
      const data = response.data;
      const mapped = data.eredmeny.map(mapBackendEventToEvent);
      setEvents(mapped);
      if (data.eredmeny.length === 0) {
        toast({
          title: "No Events Found",
          description: "No events match the specified criteria.",
          variant: "warning",
          duration: 3000
        });
      }else{
        toast({
          title: "Query Successful",
          description: `Found ${data.eredmeny.length} events matching your criteria.`,
          variant: "success",
          duration: 3000
        });
      }
      
    }catch (error) {
      console.error("❌Issue during the request:", error);
        toast({
          title: "Error",
          description: "Failed to fetch events.",
          variant: "destructive",
          duration: 3000
        });
    }

  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
            {/* Header with Sidebar Trigger */}
            <div className="p-4 border-b bg-white/80 backdrop-blur-sm ">
              <div className="flex items-center gap-4 ">
                <SidebarTrigger />
                <div className="flex items-center gap-3 sticky top-0">
                  <Book className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Napló
                  </h1>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 pt-16">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Description */}
                <div className="text-center">
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Kezelje és kövesse nyomon a eseményeket hatékonyan, fejlett szűrési és keresési lehetőségekkel.
                  </p>
                </div>

                {/* Add Event Button */}
                <div className="flex justify-center">
                  <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Új Esemény Hozzáadása
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                          <DialogTitle className="text-xl font-semibold text-gray-800">Új esemyény hozzáadása</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Töltse ki az adatokat egy új esemény létrehozásához.
                        </DialogDescription>
                      </DialogHeader>
                      <EventForm 
                        onSubmit={handleAddEvent} 
                        onCancel={() => setIsAddEventOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Query Filters */}
                <QueryFilters
                  fromDate={fromDate}
                  toDate={toDate}
                  issueType={issueType}
                  onFromDateChange={setFromDate}
                  onToDateChange={setToDate}
                  onIssueTypeChange={setIssueType}
                  onQuery={handleQuery}
                  showQueryButton={shouldShowQueryButton}
                />

                {/* Events Display */}
                <EventsList
                  events={events}
                  onViewEvent={openViewDialog}
                  onEditEvent={openEditDialog}
                  onDeleteEvent={handleDeleteEvent}
                />

                {/* Edit Event Dialog */}
                <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">Esemény szerkesztés</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Frissítse az esemény részleteit az alábbiakban.
                      </DialogDescription>
                    </DialogHeader>
                    {editingEvent && (
                      <EventForm 
                        onSubmit={(data) => {
                          const updatedEvent: Event = {
                            ...editingEvent!,
                            ...data,
                          };
                          handleEditEvent(updatedEvent);
                        }} 
                        onCancel={() => {
                          setIsEditEventOpen(false);
                          setEditingEvent(null);
                        }}
                        initialData={{
                          ID: editingEvent.ID,
                          Reported_Time : new Date(editingEvent.Reported_Time),
                          Settlement: editingEvent.Settlement,
                          Street: editingEvent.Street,
                          House_Number: editingEvent.House_Number,
                          Desc: editingEvent.Desc,
                          Response: editingEvent.Response,
                          Failure_Type: editingEvent.Failure_Type,
                          Worker_Name: editingEvent.Worker_Name,
                          HandOver_Time: new Date(editingEvent.HandOver_Time)
                        }}
                        readOnly={false} 
                      />
                    )}
                  </DialogContent>
                </Dialog>

                {/* View Event Dialog */}
                <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Esemény részletei
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Itt láthatja az esemény összes részletét.
                      </DialogDescription>
                    </DialogHeader>

                    {viewingEvent && (
                      <EventForm
                        
                        onSubmit={() => {}}
                        onCancel={() => {
                          setIsViewEventOpen(false);
                          setViewingEvent(null);
                        }}
                        initialData={{
                          ID: viewingEvent.ID,
                          Reported_Time : new Date(viewingEvent.Reported_Time),
                          Settlement: viewingEvent.Settlement,
                          Street: viewingEvent.Street,
                          House_Number: viewingEvent.House_Number,
                          Desc: viewingEvent.Desc,
                          Response: viewingEvent.Response,
                          Failure_Type: viewingEvent.Failure_Type,
                          Worker_Name: viewingEvent.Worker_Name,
                          HandOver_Time: new Date(viewingEvent.HandOver_Time)
                        }}
                        readOnly={true} 
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
      <ScrollTopFloating />
    </SidebarProvider>
    
  );
};

export default DispatcherDiary;
