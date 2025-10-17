/**
 * The `Index` component serves as the landing page for the application.
 * It provides an overview of the system's features and navigation options
 * to key sections such as the "Napló" (Diary) and "Előzmények" (History).
 *
 * @component
 * @returns {JSX.Element} The rendered landing page with a welcoming message,
 * feature highlights, and navigation cards.
 *
 * @description
 * - The page is styled with a gradient background and responsive layout.
 * - Includes two main sections:
 *   1. "Napló" card: Links to the dispatcher diary page.
 *   2. "Előzmények" card: Links to the history diary page.
 * - Each card highlights its respective features and includes a button for navigation.
 * - Additional feature highlights are displayed in a list format within the cards.
 *
 * @example
 * <Index />
 *
 * @dependencies
 * - `react-router-dom`: For navigation using the `Link` component.
 * - `lucide-react`: For icons such as `ArrowRight`, `Book`, and `HistoryIcon`.
 * - Custom UI components: `Button`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { HistoryIcon } from 'lucide-react';
const Index = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Üdvözöllek a Rendszerben
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Átfogó megoldásod a műveletek kezelésére, események nyomon követésére és a működési kiválóság fenntartására.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Book className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Napló
              </CardTitle>
              <CardDescription className="text-gray-600">
                Kezelje és kövesse nyomon az összes eseményt fejlett szűrési és keresési lehetőségekkel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/dispatcher-diary">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Napló Megtekintése
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Főbb Funkciók
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Események hozzáadása és kezelése</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span>Fejlett dátumtartomány szűrés</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Probléma típusok kategorizálása</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span>Valós idejű eseménykövetés</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <HistoryIcon className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Előzmények
              </CardTitle>
              <CardDescription className="text-gray-600">
                Kezelje és kövesse nyomon az összes napló megtörtént eseményeit fejlett szűrési és keresési lehetőségekkel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/history-diary">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Előzmények Megtekintése
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Főbb Funkciók
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span>Fejlett dátumtartomány szűrés</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span>Valós idejű eseménykövetés</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
