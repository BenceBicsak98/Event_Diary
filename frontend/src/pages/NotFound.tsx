/**
 * A React functional component that renders a 404 Not Found page.
 * This component is displayed when a user attempts to access a route
 * that does not exist in the application.
 *
 * @component
 *
 * @example
 * // Usage in a React Router setup
 * <Route path="*" element={<NotFound />} />
 *
 * @remarks
 * - Logs a 404 error message to the console with the attempted route path.
 * - Provides a link for users to navigate back to the home page.
 *
 * @returns {JSX.Element} A styled 404 Not Found page with a message and a link to the home page.
 */

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
