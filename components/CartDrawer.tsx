'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingCart } from 'lucide-react';

import { CartDrawerProps } from '@/constants/types';


export default function CartDrawer({ isOpen, onClose, cartItems = [] }: CartDrawerProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // Handle smooth entrance/exit state synchronization
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small timeout allows the element to render in DOM before triggering CSS transition
            const timer = setTimeout(() => setAnimateIn(true), 10);
            document.body.style.overflow = 'hidden';
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
            // Wait for CSS animation (300ms) to complete before unmounting
            const timer = setTimeout(() => setShouldRender(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-100 overflow-hidden">
            {/* Backdrop with Fade transition */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${animateIn ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex md:pl-10">
                <div
                    className={`w-screen max-w-md bg-[#F2F2F2] text-black shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                        <h2 className="text-xl font-bold tracking-tight text-black">My Cart</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-black hover:opacity-70 transition-opacity outline-none"
                            aria-label="Close cart"
                        >
                            <X size={20} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-12">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <ShoppingCart size={48} strokeWidth={1.5} className="mb-4 text-black" />
                                <p className="">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
                                        <div>
                                            <h4 className="font-bold">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold">${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {cartItems.length > 0 && (
                        <div className="p-6 bg-white border-t border-gray-200">
                            <Link
                                href="/checkout"
                                className="w-full bg-jb-yellow text-black font-bold py-3 px-4 rounded text-center block hover:brightness-95 transition"
                            >
                                Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}