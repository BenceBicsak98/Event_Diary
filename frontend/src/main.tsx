/**
 * Entry point of the React application.
 * 
 * This file is responsible for rendering the root component of the application
 * into the DOM. It uses React's `createRoot` API to initialize the application
 * and wraps the main `App` component with the `UserProvider` context to manage
 * user-related state globally.
 * 
 * - Imports:
 *   - `createRoot` from `react-dom/client` to create the root for rendering.
 *   - `App` as the main application component.
 *   - `index.css` for global styles.
 *   - `UserProvider` from `UserContext.tsx` to provide user context to the app.
 * 
 * - Functionality:
 *   - Selects the DOM element with the ID `root` as the mounting point.
 *   - Wraps the `App` component with `UserProvider` to enable context usage.
 *   - Renders the application into the selected DOM element.
 * 
 * Note:
 * - The `!` operator is used to assert that the `root` element exists in the DOM.
 */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './components/UserContext.tsx';

createRoot(document.getElementById("root")!).render(
<UserProvider>
    <App />
</UserProvider>
);
