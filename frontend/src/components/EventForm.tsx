/**
 * EventForm Component
 *
 * This component renders a form for creating, editing, or viewing event data. 
 * It supports both editable and read-only modes, and dynamically adjusts its 
 * fields and behavior based on the user's admin status and the provided initial data.
 *
 * @param {EventFormProps} props - The props for the EventForm component.
 * @param {Function} props.onSubmit - Callback function triggered when the form is submitted.
 * @param {Function} props.onCancel - Callback function triggered when the form is canceled.
 * @param {EventFormData | null} [props.initialData] - Optional initial data to populate the form fields.
 * @param {boolean} [props.readOnly=false] - If true, the form is rendered in read-only mode.
 *
 * @returns {JSX.Element} The rendered EventForm component.
 *
 * @example
 * <EventForm
 *   onSubmit={(data) => console.log(data)}
 *   onCancel={() => console.log('Form canceled')}
 *   initialData={{
 *     ID: 1,
 *     Reported_Time: new Date(),
 *     Settlement: "City",
 *     Street: "Main Street",
 *     House_Number: 123,
 *     Desc: "Description of the issue",
 *     Response: "Nyitott",
 *     Failure_Type: "Electrical",
 *     Worker_Name: "John Doe",
 *     HandOver_Time: new Date(),
 *   }}
 *   readOnly={false}
 * />
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, FileText, User, CheckSquare } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/components/UserContext.tsx'
import { Textarea } from './ui/textarea';
import api from '@/api/client';

interface EventFormData {
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

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  initialData?: EventFormData | null;
  readOnly?: boolean;
}

const EventForm = ({ onSubmit, onCancel, initialData = null, readOnly = false }: EventFormProps) => {

  const { ID, is_admin } = useUserData() || {};
  const [formData, setFormData] = useState<EventFormData>({
    ID: initialData?.ID || 0,
    Reported_Time: initialData?.Reported_Time || new Date(),
    Settlement: initialData?.Settlement || '',
    Street: initialData?.Street || '',
    House_Number: initialData?.House_Number || 0,
    Desc: initialData?.Desc || '',
    Response: initialData?.Response || '',
    Failure_Type: initialData?.Failure_Type || '',
    Worker_Name: initialData?.Worker_Name || '',
    HandOver_Time: initialData?.HandOver_Time || new Date()
    });

  const [formelements, setformelements] = useState<
    { SETTLEMENT_NAME: string; STREET_NAMES: string }[]
  >([]);

  const [selectedSettlement, setSelectedSettlement] = useState<string>("");
  const [selectedStreet, setSelectedStreet] = useState<string>("");
  const [selectedHouseNumber, setSelectedHouseNumber] = useState<number>(0);
  const [selectedIssue,setSelectedIssue] = useState<string>("");
  const [selectedResponse,setSelectedResponse] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [issue_types, setIssueType] = useState([]);
  const [worker_list, setWorkerList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formElementsResponse, issueTypesResponse, workersResponse] = await Promise.all([
          api.get("/formelements"),
          api.get("/issue_types"),
          api.get(`/workers/${ID}`),
        ]);
  
        setformelements(formElementsResponse.data.eredmeny);
        setIssueType(issueTypesResponse.data.eredmeny);
        setWorkerList(workersResponse.data.eredmeny);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [ID]);

  const streets = useMemo(() => {
    return (
      formelements
        .find((item) => item.SETTLEMENT_NAME === selectedSettlement)
        ?.STREET_NAMES.split(",")
        .map((s) => s.trim()) || []
    );
  }, [selectedSettlement, formelements]);

  const requiredFields: (keyof EventFormData)[] = [
    "Settlement",
    "Street",
    "House_Number",
    "Desc",
    "Failure_Type",
    "Response",
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
  
    onSubmit(formData);
    // Reset form logic...
  };

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = requiredFields.every((field) => !!formData[field]);

  if (readOnly === true) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.Failure_Type}
            </h2>
            {formData.Response === "Lezárt" && (<span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              {formData.Response}
            </span>)}
            {formData.Response === "Nyitott" && (<span className="px-3 py-1 text-sm rounded-full bg-red-100 text-gray-700">
              {formData.Response}
            </span>)}
            {formData.Response === "Folyamatban" && (<span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              {formData.Response}
            </span>)}
          </div>

          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" ></Calendar>
              <div className="flex-1"> 
                <span className="font-medium">Bejelentés: </span>
                {formData.Reported_Time.getFullYear()}.
                {(formData.Reported_Time.getMonth() + 1).toString().padStart(2, "0")}.
                {formData.Reported_Time.getDate().toString().padStart(2, "0")}
                {" "} {formData.Reported_Time.getHours().toString().padStart(2, "0")}:
                {formData.Reported_Time.getMinutes().toString().padStart(2, "0")}
              </div>
            </div>

            {formData.Settlement && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Lokáció: </span>
                {formData.Settlement}, {formData.Street} {formData.House_Number}
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Leírás: </span> <br/>
            </div>

            <div className="flex-1 items-center gap-2">
              <div className="mt-1 max-h-32 overflow-y-auto">
              {formData.Desc}
              </div>
              
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Bejelentő: </span>
              {formData.Worker_Name}
            </div>

            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Átadás idő: </span>
              {formData.HandOver_Time.getFullYear()}.
              {(formData.HandOver_Time.getMonth() + 1).toString().padStart(2, "0")}.
              {formData.HandOver_Time.getDate().toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    );
  }else{
  return (
    <>
      {initialData ? (
        <div>
        {is_admin === 1 ? (
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* GRID: mobilon 1 oszlop, md-től 2 oszlop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Település */}
              <div className="space-y-2">
                <Label htmlFor="settlement" className="text-sm font-medium">
                  Település *
                </Label>
                <Select
                  value={formData.Settlement}
                  onValueChange={(value) => {
                    handleChange('Settlement', value);
                    setSelectedSettlement(value);
                    setSelectedStreet("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz települést" />
                  </SelectTrigger>
                  <SelectContent>
                    {formelements.map((item) => (
                      <SelectItem key={item.SETTLEMENT_NAME} value={item.SETTLEMENT_NAME}>
                        {item.SETTLEMENT_NAME}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Utca */}
              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium">
                  Utca *
                </Label>
                <Select
                  value={formData.Street}
                  disabled={!formData.Settlement}
                  onValueChange={(value) => {
                    handleChange('Street', value);
                    setSelectedStreet(value);
                    setSelectedHouseNumber(0);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz utcát" />
                  </SelectTrigger>
                  <SelectContent>
                    {formelements
                      .find((item) => item.SETTLEMENT_NAME === formData.Settlement)
                      ?.STREET_NAMES.split(",")
                      .map((name, index) => (
                        <SelectItem key={index} value={name.trim()}>
                          {name.trim()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Házszám */}
              <div className="space-y-2">
                <Label htmlFor="houseNumber" className="text-sm font-medium">
                  Házszám *
                </Label>
                <Input
                  id="houseNumber"
                  type="number"
                  value={formData.House_Number}
                  onChange={(e) => {
                    handleChange('House_Number', e.target.value);
                    setSelectedWorker("");
                  }}
                  placeholder="Add meg a házszámot"
                />
              </div>
        
              {/* Leírás */}
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-sm font-medium">
                  Leírás *
                </Label>
                <Input
                  id="desc"
                  value={formData.Desc}
                  onChange={(e) => handleChange('Desc', e.target.value)}
                  placeholder="Add meg a probléma leírását"
                />
              </div>

              {/* Bejelentő */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Bejelentő *
                </Label>
                <Select
                  value={formData.Worker_Name}
                  onValueChange={(value) => {
                    handleChange('Worker_Name', value);
                    setSelectedIssue("");
                    setSelectedWorker(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz bejelentőt" />
                  </SelectTrigger>
                  <SelectContent>
                    {worker_list.map((name) => (
                      <SelectItem key={name.Name} value={name.Name}>
                        {name.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Esemény típus */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Esemény típus *
                </Label>
                <Select
                  value={formData.Failure_Type}
                  onValueChange={(value) => {
                    handleChange('Failure_Type', value);
                    setSelectedResponse("");
                    setSelectedIssue(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz hibatípust" />
                  </SelectTrigger>
                  <SelectContent>
                    {issue_types.map((name) => (
                      <SelectItem key={name.FAILURE_TYPES} value={name.FAILURE_TYPES}>
                        {name.FAILURE_TYPES}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Állapot */}
              <div className="space-y-2">
                <Label htmlFor="response" className="text-sm font-medium">
                  Állapot *
                </Label>
                <Select
                  value={formData.Response}
                  onValueChange={(value) => { 
                    handleChange('Response', value);
                    setSelectedResponse(value)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz állapotot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nyitott">Nyitott</SelectItem>
                    <SelectItem value="Folyamatban">Folyamatban</SelectItem>
                    <SelectItem value="Lezárt">Lezárt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        
            {/* Gombok */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                Módosítás
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Mégse
              </Button>
            </div>
          </form>
        </div>
        ):(
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

            {/* Leírás */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-medium">
                Leírás *
              </Label>
              <Input
                id="desc"
                value={formData.Desc}
                onChange={(e) => handleChange('Desc', e.target.value)}
                placeholder="Add meg a probléma leírását"
              />
            </div>

            {/* Állapot */}
            <div className="space-y-2">
                <Label htmlFor="response" className="text-sm font-medium">
                  Állapot *
                </Label>
                <Select
                  value={formData.Response}
                  onValueChange={(value) => handleChange('Response', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz állapotot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nyitott">Nyitott</SelectItem>
                    <SelectItem value="Folyamatban">Folyamatban</SelectItem>
                    <SelectItem value="Lezárt">Lezárt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            {/* Gombok */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Módosítás
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Mégse
              </Button>
            </div>
          </form>
        </div>
        )}
        </div>
        ):(
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Település */}
              <div className="space-y-2">
                <Label htmlFor="settlement" className="text-sm font-medium">
                  Település *
                </Label>
                <Select
                  value={formData.Settlement}
                  onValueChange={(value) => {
                    handleChange('Settlement', value);
                    setSelectedSettlement(value);
                    setSelectedStreet("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz települést" />
                  </SelectTrigger>
                  <SelectContent>
                    {formelements.map((item) => (
                      <SelectItem key={item.SETTLEMENT_NAME} value={item.SETTLEMENT_NAME}>
                        {item.SETTLEMENT_NAME}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Utca */}
              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium">
                  Utca *
                </Label>
                <Select
                  value={formData.Street}
                  disabled={!selectedSettlement}
                  onValueChange={(value) => {
                    handleChange('Street', value);
                    setSelectedStreet(value);
                    setSelectedHouseNumber(0);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz utcát" />
                  </SelectTrigger>
                  <SelectContent>
                    {streets.map((name, index) => (
                      <SelectItem key={index} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Házszám */}
              <div className="space-y-2">
                <Label htmlFor="houseNumber" className="text-sm font-medium">
                  Házszám *
                </Label>
                <Input
                  id="houseNumber"
                  type="number"
                  value={formData.House_Number}
                  disabled={!selectedStreet}
                  onChange={(e) => handleChange('House_Number', e.target.value)}
                  placeholder="Add meg a házszámot"
                />
              </div>
        
              {/* Leírás */}
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-sm font-medium">
                  Leírás *
                </Label>
                <Textarea
                  id="desc"
                  value={formData.Desc}
                  onChange={(e) => handleChange('Desc', e.target.value)}
                  placeholder="Add meg a probléma leírását"
                  className="mt-1 h-24"
                >
                </Textarea>
              </div>
        
              {/* Bejelentő */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Bejelentő *
                </Label>
                <Select
                  value={formData.Worker_Name}
                  onValueChange={(value) => {
                    handleChange('Worker_Name', value);
                    setSelectedIssue("");
                    setSelectedWorker(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz bejelentőt" />
                  </SelectTrigger>
                  <SelectContent>
                    {worker_list.map((name) => (
                      <SelectItem key={name.Name} value={name.Name}>
                        {name.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Esemény típus */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Esemény típus *
                </Label>
                <Select
                  value={formData.Failure_Type}
                  onValueChange={(value) => {
                    handleChange('Failure_Type', value);
                    setSelectedIssue(value);
                    setSelectedResponse("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz hibatípust" />
                  </SelectTrigger>
                  <SelectContent>
                    {issue_types.map((name) => (
                      <SelectItem key={name.FAILURE_TYPES} value={name.FAILURE_TYPES}>
                        {name.FAILURE_TYPES}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
        
              {/* Állapot */}
              <div className="space-y-2">
                <Label htmlFor="response" className="text-sm font-medium">
                  Állapot *
                </Label>
                <Select
                  value={formData.Response}
                  onValueChange={(value) => {
                    handleChange('Response', value);
                    setSelectedResponse(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válassz állapotot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nyitott">Nyitott</SelectItem>
                    <SelectItem value="Folyamatban">Folyamatban</SelectItem>
                    <SelectItem value="Lezárt">Lezárt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        
            {/* Gombok */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!isFormValid}
              >
                Esemény hozzáadása
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Mégse
              </Button>
            </div>
          </form>
        </div>
        )
        }
    </>
  );
  }
};


export default EventForm;
