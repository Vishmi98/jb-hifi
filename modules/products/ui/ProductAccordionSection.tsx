'use client';

import React, { useState } from 'react';
import { Plus, Minus, Star } from 'lucide-react';

import { ProductAccordionSectionProps } from '../products.types';


export const ProductAccordionSection: React.FC<ProductAccordionSectionProps> = ({
    product,
    selectedVariant,
}) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        description: false,
        specs: false,
        reviews: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const { description, ratings, reviews = [] } = product;
    const activeSpecs = selectedVariant?.specifications || [];

    return (
        <div className="bg-gray-100 rounded-none py-10">
            <div className='w-[95%] md:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2'>
                <div>
                    {/* 1. DESCRIPTION ACCORDION */}
                    <div className="border-b border-black">
                        <button
                            type="button"
                            onClick={() => toggleSection('description')}
                            className="w-full pb-4 flex justify-between items-center text-left font-black text-xl md:text-2xl uppercase text-black tracking-tight hover:opacity-80 transition-opacity"
                        >
                            <span className='jb-callout-logo font-black text-xl md:text-2xl uppercase'>DESCRIPTION</span>
                            {openSections.description ? (
                                <Minus className="w-6 h-6 stroke-[3]" />
                            ) : (
                                <Plus className="w-6 h-6 stroke-[3]" />
                            )}
                        </button>

                        {openSections.description && (
                            <div className="pb-6 text-gray-800 space-y-4">
                                {description?.paragraph1 && <p>{description.paragraph1}</p>}
                                {description?.paragraph2 && <p>{description.paragraph2}</p>}
                                {description?.paragraph3 && <p>{description.paragraph3}</p>}

                                {description?.features && description.features.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <h4 className="font-bold text-black mb-2 font-lg">Key Features</h4>
                                        {description.features.map((feature, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-bold text-black">{feature.title}</h4>
                                                <p className=" text-gray-700">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {description?.videoUrl && (
                                    <div className="mt-4 aspect-video w-full max-w-2xl">
                                        <iframe
                                            src={description.videoUrl}
                                            title="Product overview video"
                                            className="w-full h-full rounded border border-gray-300"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. SPECS ACCORDION (Swaps specifications based on selectedVariant) */}
                    <div className="border-b border-black">
                        <button
                            type="button"
                            onClick={() => toggleSection('specs')}
                            className="w-full py-4 flex justify-between items-center text-left font-black text-xl md:text-2xl uppercase text-black tracking-tight hover:opacity-80 transition-opacity"
                        >
                            <span className='jb-callout-logo font-black text-xl md:text-2xl uppercase'>SPECS</span>
                            {openSections.specs ? (
                                <Minus className="w-6 h-6 stroke-[3]" />
                            ) : (
                                <Plus className="w-6 h-6 stroke-[3]" />
                            )}
                        </button>

                        {openSections.specs && (
                            <div className="pb-6">
                                {activeSpecs.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-2">
                                        {activeSpecs.map((spec, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between py-2 border-b gap-10 border-gray-300"
                                            >
                                                <span className="font-bold text-black">{spec.name}:</span>
                                                <span className="text-gray-700 text-right">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className=" text-gray-600 italic">
                                        No specifications available for this variant.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. REVIEWS ACCORDION */}
                    <div className="border-b border-black">
                        <button
                            type="button"
                            onClick={() => toggleSection('reviews')}
                            className="w-full py-4 flex justify-between items-center text-left font-black text-xl md:text-2xl uppercase text-black tracking-tight hover:opacity-80 transition-opacity"
                        >
                            <span className='jb-callout-logo font-black text-xl md:text-2xl uppercase'>REVIEWS</span>
                            {openSections.reviews ? (
                                <Minus className="w-6 h-6 stroke-[3]" />
                            ) : (
                                <Plus className="w-6 h-6 stroke-[3]" />
                            )}
                        </button>

                        {openSections.reviews && (
                            <div className="pb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-jb-yellow">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                fill={i < Math.floor(ratings || 5) ? 'currentColor' : 'none'}
                                                className={i < Math.floor(ratings || 5) ? 'text-jb-yellow' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-black">{ratings ? ratings.toFixed(1) : '5.0'} / 5</span>
                                    <span className=" text-gray-500">({reviews.length} reviews)</span>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="space-y-3">
                                        {reviews.map((rev, idx) => (
                                            <div key={idx} className="bg-white p-3 border border-gray-200 ">
                                                {rev}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className=" text-gray-600">No customer reviews yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};