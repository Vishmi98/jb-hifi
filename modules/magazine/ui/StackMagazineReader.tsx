/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2,
    ZoomIn,
    ZoomOut,
    Grid,
} from 'lucide-react';

import { MagPage, PAGES } from './MagPages';


export default function StackMagazineReader() {
    const flipBookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const PAGE_WIDTH = 335;
    const PAGE_HEIGHT = 500;

    // Detect mobile viewport to toggle single/double page mode dynamically
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handlePageChange = (e: { data: number }) => {
        setCurrentPage(e.data);
    };

    const nextPrevPage = (direction: 'next' | 'prev') => {
        if (flipBookRef.current) {
            if (direction === 'next') {
                flipBookRef.current.pageFlip().flipNext();
            } else {
                flipBookRef.current.pageFlip().flipPrev();
            }
        }
    };

    const jumpToPage = (pageIndex: number) => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().turnToPage(pageIndex);
            setShowThumbnails(false);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => console.error(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleZoom = (type: 'in' | 'out') => {
        if (type === 'in') setZoom((prev) => Math.min(prev + 0.2, 1.5));
        if (type === 'out') setZoom((prev) => Math.max(prev - 0.2, 0.8));
    };

    const isSinglePageMode = isMobile || currentPage === 0;

    // Offset single page views (or cover page on desktop) to keep it horizontally centered
    const offsetX = !isMobile && currentPage === 0 ? -(PAGE_WIDTH / 2) : 0;

    const FlipBook = HTMLFlipBook as React.ComponentType<any>;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen bg-jb-yellow flex flex-col justify-between"
        >
            {/* Header Bar */}
            <header className="h-12 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between z-20">
                <div className="flex items-center space-x-3">
                    <span className="font-black tracking-wider text-gray-300">
                        Deals for dad!
                    </span>
                    <span className="text-xs text-neutral-400 border-l border-neutral-700 pl-3">
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="text-xs text-neutral-400">Page</span>
                            <span className="text-xs font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
                                {isSinglePageMode
                                    ? `${currentPage + 1}`
                                    : `${currentPage + 1}-${Math.min(currentPage + 2, PAGES.length)}`}
                            </span>
                            <span className="text-xs text-neutral-500">of {PAGES.length}</span>
                        </div>
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-2">
                    <button
                        onClick={() => handleZoom('out')}
                        className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-neutral-400 w-10 text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={() => handleZoom('in')}
                        className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-neutral-800 my-auto mx-1" />

                    <button
                        onClick={() => setShowThumbnails(!showThumbnails)}
                        className={`p-1.5 rounded transition ${showThumbnails
                            ? 'bg-jb-yellow text-black'
                            : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                            }`}
                        title="Thumbnails"
                    >
                        <Grid className="w-4 h-4" />
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
                        title="Fullscreen"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <div className="md:hidden flex items-center space-x-2">
                    <span className="text-xs font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
                        {currentPage + 1}
                    </span>
                    <span className="text-xs text-neutral-500">/ {PAGES.length}</span>
                </div>
            </header>

            {/* Main Canvas Area */}
            <main className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                {/* Nav Left */}
                <button
                    onClick={() => nextPrevPage('prev')}
                    disabled={currentPage === 0}
                    className="absolute left-2 md:left-10 z-10 p-2 disabled:opacity-30 text-black/50 hover:text-black transition"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Dynamic Centering + Zoom Container */}
                <div
                    className="transition-all duration-500 ease-in-out flex items-center justify-center"
                    style={{
                        transform: `scale(${zoom}) translateX(${offsetX}px)`,
                    }}
                >
                    <FlipBook
                        key={isMobile ? 'mobile-flipbook' : 'desktop-flipbook'}
                        width={PAGE_WIDTH}
                        height={PAGE_HEIGHT}
                        size="fixed"
                        minWidth={PAGE_WIDTH}
                        maxWidth={PAGE_WIDTH}
                        minHeight={PAGE_HEIGHT}
                        maxHeight={PAGE_HEIGHT}
                        maxShadowOpacity={0.6}
                        showCover={true}
                        usePortrait={isMobile}
                        initialPage={0}
                        drawShadow={true}
                        flippingTime={800}
                        useMouseEvents={true}
                        mobileScrollSupport={true}
                        onFlip={handlePageChange}
                        ref={flipBookRef}
                    >
                        {PAGES.map((page) => (
                            <MagPage key={page.id} page={page} />
                        ))}
                    </FlipBook>
                </div>

                {/* Nav Right */}
                <button
                    onClick={() => nextPrevPage('next')}
                    disabled={currentPage >= PAGES.length - 1}
                    className="absolute right-2 md:right-10 z-10 p-2 disabled:opacity-30 text-black/50 hover:text-black transition"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </main>
        </div>
    );
}