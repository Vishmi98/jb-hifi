'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    label: string;
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export default function CustomSelect({
    label,
    options,
    value,
    onChange,
    className = '',
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`relative inline-block text-left shrink-0 ${className}`}>
            {/* Trigger Button with explicit height (h-9 / 36px) and vertical alignment */}
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleDropdown}
                className={`flex h-9 items-center justify-between gap-2 border border-black bg-white px-3 text-xs sm:text-sm font-semibold text-black transition-colors hover:bg-gray-50 focus:outline-none leading-none ${isOpen ? 'ring-1 ring-black' : ''
                    }`}
            >
                <span className="truncate whitespace-nowrap">
                    {selectedOption ? selectedOption.label : label}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {/* Portal Dropdown Menu */}
            {isOpen &&
                mounted &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
                        className="absolute z-[9999] w-[200px] min-w-[160px] max-h-60 overflow-y-auto border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-1 text-black"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange?.(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-medium hover:bg-yellow-300 transition-colors ${value === option.value ? 'bg-gray-100 font-bold' : 'text-black'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
}