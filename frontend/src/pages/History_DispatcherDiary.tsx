/**
 * The `History_DispatcherDiary` component is a React functional component that provides
 * a user interface for managing and viewing historical dispatcher diary events. It includes
 * features such as date range filtering, querying events from a backend, and displaying
 * the results in a list format.
 *
 * @component
 *
 * @description
 * This component allows users to filter events by specifying a date range and querying
 * the backend for matching records. It also provides a sidebar for navigation, a header
 * with a title, and a scroll-to-top button for better user experience. The component
 * validates the date range input and displays appropriate toast notifications for success
 * or error scenarios.
 *
 * @returns {JSX.Element} The rendered `History_DispatcherDiary` component.
 *
 * @example
 * ```tsx
 * import History_DispatcherDiary from './History_DispatcherDiary';
 *
 * const App = () => {
 *   return <History_DispatcherDiary />;
 * };
 *
 * export default App;
 * ```
 *
 * @remarks
 * - The component uses the `useUserData` hook to retrieve the current user's ID.
 * - It fetches data from the backend using the `fetch` API and maps the raw data
 *   to a structured format.
 * - Toast notifications are used to provide feedback to the user.
 *
 * @dependencies
 * - React
 * - `lucide-react` for icons
 * - Custom components: `AppSidebar`, `QueryFilters_to_History`, `HistoryList`, `ScrollTopFloating`
 * - Custom hooks: `use-toast`, `useUserData`
 *
 * @state
 * - `fromDate` (string): The start date for filtering events.
 * - `toDate` (string): The end date for filtering events.
 * - `history` (History_DispatcherDiaryProps[]): The list of events fetched from the backend.
 * - `shouldShowQueryButton` (boolean): Determines whether the query button is visible.
 *
 * @effect
 * - Validates the date range whenever `fromDate` or `toDate` changes.
 * - Displays a toast notification if the date range is invalid.
 *
 * @functions
 * - `mapBackendEventToEvent(raw: RawHistory_DispatcherDiaryProps): History_DispatcherDiaryProps`:
 *   Maps raw backend data to the `History_DispatcherDiaryProps` format.
 * - `handleQuery()`: Executes the query to fetch events from the backend based on the specified
 *   date range and user ID.
 *
 * @interfaces
 * - `History_DispatcherDiaryProps`: Represents the structure of a single event.
 * - `RawHistory_DispatcherDiaryProps`: Represents the raw structure of an event from the backend.
 */

import React, { useEffect, useState } from 'react';
import {HistoryIcon} from 'lucide-react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { AppSidebar } from '@/components/AppSidebar';
import QueryFilters_to_History from '@/components/QueryFilters_to_History';
import { useUserData } from '@/components/UserContext';
import HistoryList from '@/components/HistoryList';
import {ScrollTopFloating} from '@/components/ScrollButton';
import api from '@/api/client';

interface History_DispatcherDiaryProps {
  ID: number;
  Reported_Time: Date;
  History_Description: string;
  User_Name: string;
}

interface RawHistory_DispatcherDiaryProps {
  HISTORY_ID: number;
  REPORTED_TIME: string;
  DESCRIPTION: string;
  USER_NAME: string;
}
 
const History_DispatcherDiary = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [history, setHistory] = useState<History_DispatcherDiaryProps[]>([]);
  const [shouldShowQueryButton, setShouldShowQueryButton] = useState(false);
  const { ID } = useUserData() || {};

  useEffect(() => {
    if (toDate < fromDate && fromDate != '' && toDate != '' ) {
      setShouldShowQueryButton(false);
      toast({
        title: "Invalid Date Range",
        description: "The 'From' date cannot be later than the 'To' date.",
        variant: "destructive",
        duration: 3000
      });
  
    }
    if (((fromDate && toDate && toDate > fromDate ))) {
      setShouldShowQueryButton(true);
    }
  }, [fromDate, toDate]);

  function mapBackendEventToEvent(raw: RawHistory_DispatcherDiaryProps): History_DispatcherDiaryProps {
    return {
      ID: raw.HISTORY_ID,
      Reported_Time: new Date(raw.REPORTED_TIME),
      History_Description: raw.DESCRIPTION,
      User_Name: raw.USER_NAME
    };
  }

  const handleQuery = async () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toISOString().slice(0, 10) : '';
    const formattedToDate = toDate ? new Date(toDate).toISOString().slice(0, 10) : '';

    const params = {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      user_id: ID ? ID.toString() : '',
    };

    const queryParams = new URLSearchParams(params).toString();

    try{
      const response = await api.get(`/get_history_dispatcher_diary?${queryParams}`);
      const data = response.data;
      const mapped = data.eredmeny.map(mapBackendEventToEvent);
      setHistory(mapped);
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

    }catch (error){
      toast({
        title: "Query Failed",
        description: "There was an error fetching the events. Please try again.",
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
            <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <HistoryIcon className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Előzmények
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

                {/* Query Filters */}
                <QueryFilters_to_History
                  fromDate={fromDate}
                  toDate={toDate}
                  onFromDateChange={setFromDate}
                  onToDateChange={setToDate}
                  onQuery={handleQuery}
                  showQueryButton={shouldShowQueryButton}
                />

                {/* Events Display */}
                <HistoryList
                  historys={history}
                />

              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
      <ScrollTopFloating />
    </SidebarProvider>
  );
};

export default History_DispatcherDiary;
