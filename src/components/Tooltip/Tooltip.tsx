import React, { useState } from 'react';

interface TooltipProps {
  toggle: React.ReactNode;
  content: React.ReactNode;
  openOnHover?: boolean;
  closeOnLeave?: boolean;
  show?: boolean;
}

export default function Tooltip({ toggle, content, openOnHover, closeOnLeave, show }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  let hoverTimeout: NodeJS.Timeout | null = null;

  const handleMouseOver = () => {
    clearTimeout(hoverTimeout!);
    if (openOnHover) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeOnLeave) hoverTimeout = setTimeout(() => setIsOpen(false), 300);
  };

  const open = show !== undefined ? show : isOpen;

  return (
    <div className="dropdownz" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <div onClick={() => setIsOpen(!open)} className={open ? 'dropdown-open' : ''}>
        {toggle}
      </div>
      {open && <div className="tooltipz">{content}</div>}
    </div>
  );
}
