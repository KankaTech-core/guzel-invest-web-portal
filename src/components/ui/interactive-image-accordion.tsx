"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { MoveRight } from 'lucide-react';

interface AccordionItemData {
    id: string;
    titleKey: string;
    imageUrl: string;
}

const accordionItems: AccordionItemData[] = [
    {
        id: 'residential',
        titleKey: 'categories.residentialProjects',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'villas',
        titleKey: 'categories.villasForSale',
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    },
    {
        id: 'apartments',
        titleKey: 'categories.apartmentsForSale',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'land',
        titleKey: 'categories.landForSale',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2089&auto=format&fit=crop',
    },
    {
        id: 'commercial',
        titleKey: 'categories.commercialProperties',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    },
];

interface AccordionItemProps {
    item: AccordionItemData;
    isActive: boolean;
    onMouseEnter: () => void;
    title: string;
}

const AccordionItem = ({ item, isActive, onMouseEnter, title }: AccordionItemProps) => {
    return (
        <div
            className={cn(
                "relative h-[450px] rounded-2xl overflow-hidden cursor-pointer bg-gray-100",
                "transition-all duration-700 ease-in-out",
                isActive ? "w-[400px]" : "w-[60px]"
            )}
            onMouseEnter={onMouseEnter}
        >
            {/* Background Image */}
            <Image
                src={item.imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes={isActive ? "400px" : "60px"}
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Caption Text */}
            <span
                className={cn(
                    "absolute text-white text-lg font-semibold whitespace-nowrap",
                    "transition-all duration-300 ease-in-out",
                    isActive
                        ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100"
                        : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-60"
                )}
            >
                {title}
            </span>
        </div>
    );
};

export function LandingAccordion() {
    const [activeIndex, setActiveIndex] = useState(0);
    const t = useTranslations();

    const handleItemHover = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="bg-white font-sans overflow-hidden">
            <section className="container-custom py-12 md:py-24">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Side: Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tighter font-outfit">
                            {t("hero.title")}
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                            {t("hero.subtitle")}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Link
                                href="/portfoy"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                {t("hero.cta")}
                                <MoveRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Image Accordion */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-row items-center justify-center gap-4 p-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                            {accordionItems.map((item, index) => (
                                <AccordionItem
                                    key={item.id}
                                    item={item}
                                    title={t(item.titleKey)}
                                    isActive={index === activeIndex}
                                    onMouseEnter={() => handleItemHover(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
