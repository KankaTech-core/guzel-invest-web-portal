import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ProjectSummary } from './components/ProjectSummary';
import { Visuals } from './components/Visuals';
import { MapAndCTA } from './components/MapAndCTA';
import SPRouteNavigator from '@/components/single-project/SPRouteNavigator';
import SPLayout from '@/components/single-project/SPLayout';

export default function SingleProjectPageS4() {
    return (
        <SPLayout>
            <main className="flex flex-col bg-[#faf9f6] text-slate-900 min-h-screen font-sans selection:bg-[#ec6804]/30 overflow-x-hidden">
                <HeroSection />
                <ProjectSummary />
                <Visuals />
                <MapAndCTA />
                <SPRouteNavigator />
            </main>
        </SPLayout>
    );
}
