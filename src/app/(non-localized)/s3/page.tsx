import React from 'react';
import { HeroSection, PropertiesRibbon } from './components/HeroSection';
import { ProjectSummary } from './components/ProjectSummary';
import { MainVisuals } from './components/MainVisuals';
import { Sidebar } from './components/Sidebar';
import SPRouteNavigator from '@/components/single-project/SPRouteNavigator';
import SPLayout from '@/components/single-project/SPLayout';

export default function SingleProjectPageS3() {
    return (
        <SPLayout>
            <div className="flex flex-col min-h-screen w-full mx-auto max-w-[1440px] bg-white shadow-2xl my-0 sm:mb-8 text-[#0F172A] font-sans antialiased overflow-x-clip">
                <HeroSection />
                <PropertiesRibbon />
                <main className="grid grid-cols-1 xl:grid-cols-12 gap-0 xl:divide-x divide-gray-200 bg-[#f8f7f5]">
                    {/* Left Column (Main Content) */}
                    <div className="xl:col-span-8 flex flex-col gap-0 divide-y divide-gray-200">
                        <ProjectSummary />
                        <MainVisuals />
                    </div>
                    {/* Right Column (Sidebar) */}
                    <Sidebar />
                </main>
                <SPRouteNavigator />
            </div>
        </SPLayout>
    );
}
