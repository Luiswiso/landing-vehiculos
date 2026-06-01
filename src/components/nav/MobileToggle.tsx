"use client";

import { useState } from "react";

interface MobileToggleProps {
  onToggle?: (_open: boolean) => void;
}

export function MobileToggle({ onToggle }: MobileToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  }

  return (
    <button
      data-testid="nav-mobile-toggle"
      type="button"
      aria-expanded={isOpen ? "true" : "false"}
      aria-label={
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      }
      onClick={handleClick}
      className="md:hidden flex flex-col justify-center items-center gap-1 p-2 rounded-card text-ink hover:bg-surface-muted transition-colors"
    >
      <span
        aria-hidden="true"
        className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? "translate-y-1.5 rotate-45" : ""}`}
      />
      <span
        aria-hidden="true"
        className={`block w-6 h-0.5 bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
      />
      <span
        aria-hidden="true"
        className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
      />
    </button>
  );
}
