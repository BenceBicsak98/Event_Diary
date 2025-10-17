
/**
 * A React component for rendering a query filter card with date inputs and an optional query button.
 * This component is designed to allow users to filter data based on a date range and trigger a query action.
 *
 * @component
 * @param {string} fromDate - The starting date for the filter, displayed in the "Kezdő dátum" input field.
 * @param {string} toDate - The ending date for the filter, displayed in the "Vég dátum" input field.
 * @param {(date: string) => void} onFromDateChange - Callback function triggered when the "Kezdő dátum" input value changes.
 * @param {(date: string) => void} onToDateChange - Callback function triggered when the "Vég dátum" input value changes.
 * @param {() => void} onQuery - Callback function triggered when the "Keresés" button is clicked.
 * @param {boolean} showQueryButton - Determines whether the "Keresés" button is visible. 
 *                                    The button is displayed only when this value is `true`.
 *
 * @returns {JSX.Element} A styled card component containing date inputs and an optional query button.
 *
 * @example
 * <QueryFilters
 *   fromDate="2023-01-01"
 *   toDate="2023-01-31"
 *   onFromDateChange={(date) => console.log('From Date:', date)}
 *   onToDateChange={(date) => console.log('To Date:', date)}
 *   onQuery={() => console.log('Query triggered')}
 *   showQueryButton={true}
 * />
 */
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QueryFiltersProps_History {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onQuery: () => void;
  showQueryButton: boolean;
}

const QueryFilters = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onQuery,
  showQueryButton
}: QueryFiltersProps_History) => {
  

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <Filter className="h-5 w-5 text-blue-600" />
          Szűrő és Keresés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Query Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border">
          <div className="space-y-2">
            <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">
              Kezdő dátum
            </Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">
              Vég dátum
            </Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Query Button - Only visible when all filters are selected */}
        {showQueryButton && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={onQuery}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Keresés
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryFilters;
