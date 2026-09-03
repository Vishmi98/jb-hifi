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

const PAGES = [
    {
        id: 1,
        title: 'COVER PAGE',
        bg: 'from-amber-400 to-yellow-500',
        content: (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#ffe600]">
                <img
                    src="/mg1.jpg"
                    alt="JB Hi-Fi Deals For Dad Catalog Cover"
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>
        ),
    },
    {
        id: 2,
        title: 'NEW AT JB!',
        bg: 'from-slate-100 to-gray-200',
        content: (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#ffe600]">
                <img
                    src="/mg2.png"
                    alt="JB Hi-Fi Deals For Dad Catalog Page 2"
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>
        ),
    },
    {
        id: 3,
        title: 'OURA RING',
        bg: 'from-stone-100 to-amber-50',
        content: (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#ffe600]">
                <img
                    src="/mg3.png"
                    alt="JB Hi-Fi Deals For Dad Catalog Page 3"
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>
        ),
    },
    {
        id: 4,
        title: 'TECH SPOTLIGHT',
        bg: 'from-slate-900 to-indigo-950',
        content: (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#ffe600]">
                {/* Base Background Image Layer */}
                <img
                    src="/mg4.png"
                    alt="Catalogue Background Base Layer"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                />

                {/* SVG Vector Text / Details Layer */}
                <img
                    src="https://catalogue.jbhifi.com.au/2026/08/24-08-dfd/files/assets/common/page-vectorlayers/0004.svg?uni=848e4263ba0ee3dbe7225a8cb8f5e113"
                    alt="JB Hi-Fi Deals For Dad Catalog Page Layer"
                    className="relative w-full h-full object-contain drop-shadow-md z-10"
                />
            </div>
        ),
    },
    {
        id: 5,
        title: 'BACK COVER',
        bg: 'from-neutral-950 to-black',
        content: (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#ffe600]">
                {/* Base Background Image Layer */}
                <img
                    src="/mg5.png"
                    alt="Catalogue Background Base Layer"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                />

                {/* SVG Vector Text / Details Layer */}
                <img
                    src="https://catalogue.jbhifi.com.au/2026/08/24-08-dfd/files/assets/common/page-vectorlayers/0005.svg?uni=848e4263ba0ee3dbe7225a8cb8f5e113"
                    alt="JB Hi-Fi Deals For Dad Catalog Page Layer"
                    className="relative w-full h-full object-contain drop-shadow-md z-10"
                />
            </div>
        ),
    },
];

const Page = React.forwardRef<HTMLDivElement, { page: (typeof PAGES)[0] }>(
    ({ page }, ref) => {
        return (
            <div
                ref={ref}
                className="w-full h-full shadow-xl overflow-hidden flex flex-col select-none"
            >
                {page.content}
            </div>
        );
    }
);
Page.displayName = 'Page';

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
                            <Page key={page.id} page={page} />
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