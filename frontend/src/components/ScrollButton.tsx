/**
 * A floating button component that becomes visible when the user scrolls down
 * a certain distance on the page. When clicked, it smoothly scrolls the user
 * back to the top of the page.
 *
 * @component
 *
 * @example
 * <ScrollTopFloating />
 *
 * @returns {JSX.Element} A button element that appears at the bottom-right corner of the screen.
 *
 * @remarks
 * - The button uses the `lucide-react` library for the arrow icon.
 * - The visibility of the button is controlled by the `visible` state, which
 *   is updated based on the scroll position of the window.
 * - The button has a smooth transition effect for its opacity and is styled
 *   with Tailwind CSS classes.
 *
 * @dependencies
 * - `useState` and `useEffect` from React for state management and side effects.
 * - `ArrowUp` icon from the `lucide-react` library.
 *
 * @accessibility
 * - Includes an `aria-label` attribute for screen readers to describe the button's purpose.
 */

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollTopFloating() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed right-4 bottom-4 z-50 p-3 rounded-full shadow-lg transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bg-indigo-600 hover:bg-indigo-700 text-white`}
      aria-label="Vissza a tetejére"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}