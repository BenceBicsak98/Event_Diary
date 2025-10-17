
/**
 * A React component that provides a user interface for filtering and querying data.
 * It includes date pickers for selecting a date range, a dropdown for selecting an issue type,
 * and an optional query button for triggering a search action.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.fromDate - The starting date for the query filter.
 * @param {string} props.toDate - The ending date for the query filter.
 * @param {string} props.issueType - The selected issue type for the query filter.
 * @param {(date: string) => void} props.onFromDateChange - Callback function triggered when the starting date changes.
 * @param {(date: string) => void} props.onToDateChange - Callback function triggered when the ending date changes.
 * @param {(type: string) => void} props.onIssueTypeChange - Callback function triggered when the issue type changes.
 * @param {() => void} props.onQuery - Callback function triggered when the query button is clicked.
 * @param {boolean} props.showQueryButton - Determines whether the query button is displayed.
 *
 * @returns {JSX.Element} The rendered QueryFilters component.
 *
 * @example
 * <QueryFilters
 *   fromDate="2023-01-01"
 *   toDate="2023-01-31"
 *   issueType="network"
 *   onFromDateChange={(date) => console.log("From Date:", date)}
 *   onToDateChange={(date) => console.log("To Date:", date)}
 *   onIssueTypeChange={(type) => console.log("Issue Type:", type)}
 *   onQuery={() => console.log("Query triggered")}
 *   showQueryButton={true}
 * />
 */

import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/api/client';

interface QueryFiltersProps {
  fromDate: string;
  toDate: string;
  issueType: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onIssueTypeChange: (type: string) => void;
  onQuery: () => void;
  showQueryButton: boolean;
}

const QueryFilters = ({
  fromDate,
  toDate,
  issueType,
  onFromDateChange,
  onToDateChange,
  onIssueTypeChange,
  onQuery,
  showQueryButton
}: QueryFiltersProps) => {

  const [issuetypes, setIssuetypes] = useState([]);

  useEffect(() => {
    const fetchIssueTypes = async () => {
      try {
        const response = await api.get('/issue_types');
        setIssuetypes(response.data.eredmeny);
        console.log("Fetched issue types:", response.data.eredmeny);
      } catch (error) {
        console.error("Error fetching issue types:", error);
      }
    };
  
    fetchIssueTypes();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl border">
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

          <div className="space-y-2">
            <Label htmlFor="issueType" className="text-sm font-medium text-gray-700">
              Esemény típus
            </Label>
            <Select value={issueType} onValueChange={onIssueTypeChange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Válasszon jelentés típust" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Nincs kiválasztva --</SelectItem>
                {issuetypes.map((type, index) => (
                  <SelectItem key={index} value={type.FAILURE_TYPES}>
                    {type.FAILURE_TYPES}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
