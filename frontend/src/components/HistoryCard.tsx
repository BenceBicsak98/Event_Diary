/**
 * A React component that renders a history card based on the provided history data.
 * The card displays details about an event, such as the type of event, the user who reported it,
 * the date and time of the report, and additional details about the event.
 *
 * @component
 * @param {HistoryListProps} props - The props for the component.
 * @param {History} props.history - The history object containing details about the event.
 *
 * @returns {JSX.Element} A styled card displaying the history details.
 *
 * @example
 * ```tsx
 * const history = {
 *   ID: 1,
 *   Reported_Time: new Date(),
 *   History_Description: "            Esemény módosítás. \nField1:Value1 -> Field1:Value2",
 *   User_Name: "John Doe"
 * };
 *
 * <HistoryCard history={history} />
 * ```
 *
 * @remarks
 * - The component handles three types of events based on the first line of the `History_Description`:
 *   - "Esemény módosítás."
 *   - "Új esemény rögzítés."
 *   - Other events are treated as "Esemény törlése."
 * - The `History_Description` is split into parts by newlines, and each part is rendered as a list item.
 * - If a part contains a "->" symbol, it is split into a before and after state, which are styled differently.
 *
 * @function timedesing
 * Formats the time from the `Reported_Time` property of the history object.
 *
 * @function datedesing
 * Formats the date from the `Reported_Time` property of the history object.
 */

import { Calendar, Clock, User, Info, ArrowRight } from 'lucide-react';

interface History {
  ID: number;
  Reported_Time: Date;
  History_Description: string;
  User_Name: string;
}

interface HistoryListProps {
  history: History;
}

const HistoryCard = ( {history}: HistoryListProps) => {

  function timedesing(history) {
    const hour = history.Reported_Time.getHours().toString().padStart(2, "0");
    const minute = history.Reported_Time.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }
  
  function datedesing(history) {
    const month = (history.Reported_Time.getMonth() + 1).toString().padStart(2, "0");
    const day = history.Reported_Time.getDate().toString().padStart(2, "0");
    return `${month}.${day}`;
  }

  const parts = history.History_Description.split('\n').filter(part => part.trim() !== '');

  console.log(parts[0]);

  if (!history) {
    return <div>Nincs elérhető előzmény.</div>;
  }else {
    if (parts[0] == "            Esemény módosítás. ") {
      return (
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Fejléc */}
            <h2 className="text-lg font-bold text-gray-900">Esemény módosítás</h2>
            <div className="flex gap-10 mt-2 text-sm text-gray-700">
              <p className="flex items-center gap-1">
                <Calendar size={14} /> {history.Reported_Time.getFullYear()}.
                {datedesing(history)}
              </p>
              <p className="flex items-center gap-1">
                <User size={14} /> {history.User_Name}
              </p>
            </div>
    
            {/* Idő */}
            <p className="mt-1 flex items-center text-gray-600 text-sm">
              <Clock size={14} className="mr-1" /> {timedesing(history)}
            </p>
    
            {/* Részletek */}
            <div className="mt-3">
              <p className="text-gray-800 font-medium mb-1 flex items-center gap-1">
                <Info size={14} /> Esemény részletei:
              </p>
              <ul className="space-y-1">
                {parts.map((part, index) => {
                  
                          const [before, after] = part.split("->");
                          const [value, unit] = before.split(":");
                      
                          return (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            {after ? (
                            <>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">{value}:</span>
                              <span className="px-2 py-0.5 bg-red-100 rounded-md text-red-800">
                              {unit}
                              </span>
                              <ArrowRight size={14} className="text-gray-500" />
                              <span className="px-2 py-0.5 bg-green-100 text-darkgreen-800 rounded-md">
                              {after}
                              </span>
                            </>
                            ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-darkgreen-800 rounded-md">{part}</span>
                            )}
                          </li>
                          );
                        
                        }
                  )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      );
    }else if (parts[0] == "            Új esemény rögzítés. ") {
      return (
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Fejléc */}
            <h2 className="text-lg font-bold text-gray-900">Új esemény rögzítése</h2>
            <div className="flex gap-10 mt-2 text-sm text-gray-700">
              <p className="flex items-center gap-1">
                <Calendar size={14} /> {history.Reported_Time.getFullYear()}.
                {datedesing(history)}
              </p>
              <p className="flex items-center gap-1">
                <User size={14} /> {history.User_Name}
              </p>
            </div>
    
            {/* Idő */}
            <p className="mt-1 flex items-center text-gray-600 text-sm">
              <Clock size={14} className="mr-1" /> {timedesing(history)}
            </p>
    
            {/* Részletek */}
            <div className="mt-3">
              <p className="text-gray-800 font-medium mb-1 flex items-center gap-1">
                <Info size={14} /> Esemény részletei:
              </p>
              <ul className="space-y-1">
                {parts.map((part, index) => {
                  return (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                        <span className="px-2 py-0.5 bg-green-100 text-darkgreen-800 rounded-md">{part}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      );
    }else{
      return (
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Fejléc */}
            <h2 className="text-lg font-bold text-gray-900">Esemény törlése</h2>
            <div className="flex gap-10 mt-2 text-sm text-gray-700">
              <p className="flex items-center gap-1">
                <Calendar size={14} /> {history.Reported_Time.getFullYear()}.
                {datedesing(history)}
              </p>
              <p className="flex items-center gap-1">
                <User size={14} /> {history.User_Name}
              </p>
            </div>
    
            {/* Idő */}
            <p className="mt-1 flex items-center text-gray-600 text-sm">
              <Clock size={14} className="mr-1" /> {timedesing(history)}
            </p>
    
            {/* Részletek */}
            <div className="mt-3">
              <p className="text-gray-800 font-medium mb-1 flex items-center gap-1">
                <Info size={14} /> Esemény részletei:
              </p>
              <ul className="space-y-1">
                {parts.map((part, index) => {
                 return (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-center gap-2"
                  >
                      <span className="px-2 py-0.5 bg-red-100 text-darkred-800 rounded-md">{part}</span>
                  </li>
                );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }
};

export default HistoryCard;
