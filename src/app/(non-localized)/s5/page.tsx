import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ProjectSummary } from './components/ProjectSummary';
import { Visuals } from './components/Visuals';
import { FooterArea } from './components/FooterArea';
import SPRouteNavigator from '@/components/single-project/SPRouteNavigator';
import SPLayout from '@/components/single-project/SPLayout';

export default function SingleProjectPageS5() {
    return (
        <SPLayout>
            <main className="flex flex-col bg-[#fdfdfd] text-[#374151] min-h-screen font-sans antialiased overflow-x-hidden w-full selection:bg-[#ec6c04]/20 selection:text-[#ec6c04]">
                <HeroSection />
                <ProjectSummary />
                <Visuals />
                <FooterArea />
                <SPRouteNavigator />
            </main>
        </SPLayout>
    );
}
