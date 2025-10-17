
/**
 * The `Login` component renders a login page for the Event Diary application.
 * It provides a form for users to input their username and password, and handles
 * authentication by sending the credentials to the backend API. Upon successful
 * login, the user is redirected to the main page, and their data is stored in the
 * application's context.
 *
 * @component
 * @returns {JSX.Element} The rendered login page.
 *
 * @remarks
 * - The component uses `useState` to manage local state for the username, password,
 *   and loading status.
 * - The `useNavigate` hook from `react-router-dom` is used for navigation.
 * - The `useUser` custom hook is used to update the user context with the logged-in
 *   user's data.
 * - The `toast` utility is used to display success or error messages.
 *
 * @example
 * ```tsx
 * import Login from './Login';
 *
 * function App() {
 *   return <Login />;
 * }
 * ```
 *
 * @dependencies
 * - `react`
 * - `react-router-dom`
 * - `lucide-react`
 * - `@/components/ui/button`
 * - `@/components/ui/input`
 * - `@/components/ui/label`
 * - `@/components/ui/card`
 * - `@/hooks/use-toast`
 * - `@/components/UserContext`
 *
 * @todo
 * - Add error handling for network issues during login.
 * - Improve accessibility for the form and its elements.
 * - Consider adding a "Forgot Password" feature.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/components/UserContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import api from '@/api/client';

const Login = () => {
  const navigate = useNavigate();
  const { setUsernames, setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    // Validate input
    if (!username || !password) { 
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: "Please enter both username and password.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      
      const response = await api.post("/token", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status !== 200) {
        toast({
          title: "Login Failed",
          description: "Invalid usernam or password or the user is disable!",
          variant: "destructive",
          duration: 3000
        });
        setIsLoading(false);
      } else {

        const userRes = await api.get(`/get_user_data?username=${username}`);

        if (userRes.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userRes.data;

        setUsernames(username);
        setUser(userData);

        setIsLoading(false);

        toast({
          title: "Login Successful",
          description: "Welcome back to the Event System!",
          variant: "success",
          duration: 3000
        });
        navigate('/index');
      }

    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login Failed",
        description: "Invalid username or password or the user is disabled!",
        variant: "destructive",
        duration: 3000
      });
    
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Event Diary
          </h1>
          <p className="text-gray-600 mt-2">Jelentkezz be a fiókodba</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Üdvözöllek
            </CardTitle>
            <CardDescription className="text-gray-600">
              Add meg a belépési adataidat a Event Diary eléréséhez
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="usernam" className="text-sm font-medium text-gray-700">
                  Felhasználónév
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="username"
                    placeholder="Add meg a felhasználó nevét"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Jelszó
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Add meg a jelszavad"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div> */}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Belépés...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Belépés
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
