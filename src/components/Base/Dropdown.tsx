import React, { useState } from 'react';

interface DropdownOption {
  id: string | number;
  text: React.ReactNode;
}

interface DropdownProps {
  toggle: React.ReactNode;
  options: DropdownOption[];
  onClick: (id: string | number) => void;
  openOnHover?: boolean;
  closeOnLeave?: boolean;
  width?: number;
}

export default function Dropdown({ toggle, options, onClick, openOnHover, closeOnLeave, width = 160 }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  let hoverTimeout: NodeJS.Timeout | null = null;

  const handleMouseOver = () => {
    clearTimeout(hoverTimeout!);
    if (openOnHover) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeOnLeave) hoverTimeout = setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="dropdownz" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <div onClick={() => setIsOpen(!isOpen)} className={isOpen ? 'dropdown-open' : ''}>
        {toggle}
      </div>
      {isOpen && (
        <ul className="options" style={{ width }}>
          {options.map(({ id, text }) => (
            <li
              key={id}
              className="pointer"
              onClick={() => {
                onClick(id);
                setIsOpen(false);
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
