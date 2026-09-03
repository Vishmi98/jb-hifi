'use client';

import React, { useRef, useState } from 'react';
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
            // <div className="flex flex-col justify-between h-full p-2 text-black bg-jb-yellow border border-black/10 overflow-hidden">
            //     {/* Header */}
            //     <div className="border-b-2 border-black pb-1 text-center shrink-0">
            //         <h1 className="text-2xl font-black italic tracking-tighter">JB HI-FI</h1>
            //         <p className="text-[9px] font-bold uppercase tracking-widest bg-black text-yellow-400 inline-block px-1.5 py-0.5">
            //             Deals For Dad!
            //         </p>
            //     </div>

            //     {/* Products Grid */}
            //     <div className="grid grid-cols-2 gap-1.5 my-1 overflow-y-auto pr-0.5 flex-1">
            //         {PRODUCTS.map((prod) => (
            //             <div
            //                 key={prod.id}
            //                 className="bg-white border border-black p-1.5 flex flex-col justify-between shadow-sm relative text-left"
            //             >
            //                 {/* Badges */}
            //                 <div className="flex flex-wrap gap-0.5 mb-1">
            //                     {prod.badge && (
            //                         <span
            //                             className={`text-[7px] font-black px-1 py-0.2 uppercase leading-tight ${prod.badgeType === 'solid-red'
            //                                 ? 'bg-red-600 text-white'
            //                                 : prod.badgeType === 'purple'
            //                                     ? 'bg-purple-700 text-white'
            //                                     : 'border border-red-600 text-red-600'
            //                                 }`}
            //                         >
            //                             {prod.badge}
            //                         </span>
            //                     )}
            //                     {prod.secondaryBadge && (
            //                         <span className="text-[7px] font-black px-1 py-0.2 uppercase bg-purple-700 text-white leading-tight">
            //                             {prod.secondaryBadge}
            //                         </span>
            //                     )}
            //                 </div>

            //                 {/* Product Image */}
            //                 <div className="w-full h-14 flex items-center justify-center my-0.5">
            //                     <img
            //                         src={prod.image}
            //                         alt={prod.title}
            //                         className="max-h-full max-w-full object-contain"
            //                     />
            //                 </div>

            //                 {/* Title */}
            //                 <h3 className="text-[9px] font-bold line-clamp-2 leading-tight text-black">
            //                     {prod.title}
            //                 </h3>

            //                 {/* Ratings */}
            //                 <div className="flex items-center space-x-0.5 my-0.5">
            //                     <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-500" />
            //                     <span className="text-[8px] font-bold">{prod.rating}</span>
            //                     <span className="text-[7px] text-gray-500">({prod.reviews})</span>
            //                 </div>

            //                 {/* Pricing Section */}
            //                 <div className="mt-auto pt-0.5 border-t border-gray-200 flex items-end justify-between">
            //                     <div>
            //                         {prod.originalPrice && (
            //                             <div className="text-[8px] line-through text-gray-500 leading-none">
            //                                 ${prod.originalPrice}
            //                             </div>
            //                         )}
            //                         <div className="text-sm font-black text-red-600 leading-none">
            //                             ${prod.price}
            //                         </div>
            //                     </div>

            //                     {prod.savings && (
            //                         <span className="text-[7px] font-black text-white bg-red-600 px-1 py-0.5 leading-none">
            //                             {prod.savings}
            //                         </span>
            //                     )}
            //                 </div>
            //             </div>
            //         ))}
            //     </div>
            // </div>
            <div>
                {/* Full Catalog Cover Image Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src="/mg1.jpg"
                        alt="JB Hi-Fi Deals For Dad Catalog Cover"
                        className="w-full h-full object-contain drop-shadow-md"
                    />
                </div>
            </div>
        ),
    },
    {
        id: 2,
        title: 'NEW AT JB!',
        bg: 'from-slate-100 to-gray-200',
        content: (
            // <div className="p-6 text-slate-900 flex flex-col justify-between h-full bg-white border-r border-gray-300">
            //     <div>
            //         <span className="bg-sky-500 text-white text-xs font-black px-2 py-1 uppercase">
            //             New at JB!
            //         </span>
            //         <h2 className="text-2xl font-black mt-3">Introducing Meta Glasses</h2>
            //         <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            //             Discover the new Meta Glasses at JB Hi-Fi. Customise your look with 4 different frame styles and smart AI built right in.
            //         </p>
            //     </div>
            // </div>
            <div>
                {/* Full Catalog Cover Image Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src="/mg2.png"
                        alt="JB Hi-Fi Deals For Dad Catalog Cover"
                        className="w-full h-full object-contain drop-shadow-md"
                    />
                </div>
            </div>
        ),
    },
    {
        id: 3,
        title: 'OURA RING',
        bg: 'from-stone-100 to-amber-50',
        content: (
            // <div className="p-6 text-slate-900 flex flex-col justify-between h-full bg-slate-50">
            //     <div>
            //         <span className="bg-jb-yellow text-black text-xs font-black px-2 py-1 uppercase border border-black">
            //             Smarter Health Starts Here
            //         </span>
            //         <h2 className="text-2xl font-black mt-3">Oura Ring 3</h2>
            //         <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            //             40% smaller. More powerful than ever. Track over 50 health metrics directly on your finger.
            //         </p>
            //     </div>
            // </div>
            <div>
                {/* Full Catalog Cover Image Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src="/mg3.png"
                        alt="JB Hi-Fi Deals For Dad Catalog Cover"
                        className="w-full h-full object-contain drop-shadow-md"
                    />
                </div>
            </div>
        ),
    },
    {
        id: 4,
        title: 'TECH SPOTLIGHT',
        bg: 'from-slate-900 to-indigo-950',
        content: (
            // <div className="p-6 text-white flex flex-col justify-between h-full bg-neutral-900 border-r border-neutral-800">
            //     <div>
            //         <h2 className="text-2xl font-bold text-yellow-400">Audio & Gear</h2>
            //         <p className="text-xs text-neutral-300 mt-2">
            //             Noise cancelling headphones, true wireless earbuds, and portable speaker highlights.
            //         </p>
            //     </div>
            // </div>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
            // <div className="p-6 text-white flex flex-col justify-between h-full bg-black text-center">
            //     <div className="my-auto space-y-3">
            //         <BookOpen className="w-12 h-12 mx-auto text-yellow-400" />
            //         <h2 className="text-xl font-bold">End of Issue</h2>
            //         <p className="text-xs text-neutral-400">Thank you for viewing</p>
            //     </div>
            // </div>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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

    const PAGE_WIDTH = 335;
    const PAGE_HEIGHT = 500;

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

    const isSinglePageMode = currentPage === 0;

    // Offset page 0 by half width to keep cover centered
    const offsetX = isSinglePageMode ? -(PAGE_WIDTH / 2) : 0;

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
                        Dealr for dad!
                    </span>
                    <span className="text-xs text-neutral-400 border-l border-neutral-700 pl-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-neutral-400">Page</span>
                            <span className="text-xs font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
                                {isSinglePageMode
                                    ? '1'
                                    : `${currentPage + 1}-${Math.min(currentPage + 2, PAGES.length)}`}
                            </span>
                            <span className="text-xs text-neutral-500">of {PAGES.length}</span>
                        </div>
                    </span>
                </div>

                <div className="flex items-center space-x-2">
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
            </header>

            {/* Main Canvas Area */}
            <main className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                {/* Nav Left */}
                <button
                    onClick={() => nextPrevPage('prev')}
                    disabled={currentPage === 0}
                    className="absolute left-30 z-10 disabled:opacity-30 text-black/50 rounded-full transition"
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
                    {/* @ts-ignore */}
                    <FlipBook
                        width={PAGE_WIDTH}
                        height={PAGE_HEIGHT}
                        size="fixed"
                        minWidth={PAGE_WIDTH}
                        maxWidth={PAGE_WIDTH}
                        minHeight={PAGE_HEIGHT}
                        maxHeight={PAGE_HEIGHT}
                        maxShadowOpacity={0.6}
                        showCover={true}
                        usePortrait={false}
                        startPage={0}
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
                    className="absolute right-30 z-10 p-3 disabled:opacity-30 text-black/50 rounded-full transition"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </main>
        </div>
    );
}