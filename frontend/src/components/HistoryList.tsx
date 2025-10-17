/**
 * A React component that renders a list of history entries. If no entries are provided,
 * it displays a placeholder message indicating that there are no entries to show.
 *
 * @component
 * @param {HistorysListProps} props - The props for the component.
 * @param {History[]} props.historys - An array of history objects to display.
 *
 * @typedef {Object} History
 * @property {number} ID - The unique identifier for the history entry.
 * @property {Date} Reported_Time - The timestamp when the history entry was reported.
 * @property {string} History_Description - A description of the history entry.
 * @property {string} User_Name - The name of the user associated with the history entry.
 *
 * @typedef {Object} HistorysListProps
 * @property {History[]} historys - An array of history objects to display.
 *
 * @returns {JSX.Element} A card component containing the list of history entries or a placeholder message.
 */

import { Book} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HistoryCard from './HistoryCard';

interface History {
  ID: number;
  Reported_Time: Date;
  History_Description: string;
  User_Name: string;
}

interface HistorysListProps {
  historys: History[];
}

const HistoryList = ({ historys }: HistorysListProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Bejegyzések</CardTitle>
      </CardHeader>
      <CardContent>
        {!historys || historys.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Nincsenek megjeleníthető bejegyzések</p>
            
          </div>
        ) : (
          <div className="space-y-4">
            {historys.map((history, index) => (
              <HistoryCard
                key={history.ID || index}
                history={history}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryList;
