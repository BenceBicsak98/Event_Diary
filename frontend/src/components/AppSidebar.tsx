/**
 * The `AppSidebar` component renders a sidebar for the application, providing
 * navigation links, user information, and a logout button.
 *
 * ### Features:
 * - Displays a header with the application title.
 * - Provides navigation links to different sections of the application.
 * - Shows the logged-in user's first and last name.
 * - Includes a logout button to handle user sign-out.
 *
 * ### Props:
 * This component does not accept any props directly. It relies on the following hooks:
 * - `useUserData`: Retrieves the current user's data, including `first_name` and `last_name`.
 * - `useNavigate`: Provides navigation functionality for redirecting the user.
 *
 * ### Dependencies:
 * - `lucide-react`: For rendering icons such as `User`, `LogOut`, `Home`, `Book`, and `HistoryIcon`.
 * - `react-router-dom`: For navigation using `useNavigate`.
 * - Custom UI components from `@/components/ui/sidebar`, `@/components/ui/button`, and `@/components/ui/separator`.
 *
 * ### Usage:
 * This component is intended to be used as part of the application's layout, providing
 * a consistent navigation experience for users.
 *
 * ### Example:
 * ```tsx
 * import { AppSidebar } from './AppSidebar';
 *
 * function App() {
 *   return (
 *     <div className="app-container">
 *       <AppSidebar />
 *       <main>
 *         {/* Main content goes here *\/}
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 **/

import { User, LogOut, Home, Book, HistoryIcon, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserData } from './UserContext';

const menuItems = [
  {
    title: "Kezdőlap",
    url: "/index",
    icon: Home,
  },
  {
    title: "Napló",
    url: "/dispatcher-diary",
    icon: Book,
  },
  {
    title: "Előzmények",
    url: "/history-diary",
    icon: HistoryIcon,
  },
  {
    title: "VasiViz AI Chat",
    url: "/vasi-ai",
    icon: Bot,
  },
];

export function AppSidebar() {

  const { first_name, last_name } = useUserData() || {};

  const navigate = useNavigate();
  const handleLogout = () => {
    // This would handle actual logout logic
    navigate('/');
  };
    return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="font-semibold text-lg">Napló rendszer</h2>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigáció</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter className="p-4">
          <div className="space-y-2">
            <Separator />
            <div className="flex items-center gap-2 py-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">{first_name} {last_name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Kilépés
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
 
}
