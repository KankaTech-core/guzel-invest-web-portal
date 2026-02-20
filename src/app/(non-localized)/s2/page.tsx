import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ProjectInfo } from './components/ProjectInfo';
import { Visuals } from './components/Visuals';
import { MapAndCTA } from './components/MapAndCTA';
import SPRouteNavigator from '@/components/single-project/SPRouteNavigator';
import SPLayout from '@/components/single-project/SPLayout';

export default function SingleProjectPageS2() {
    return (
        <SPLayout>
            <main className="flex flex-col bg-white text-gray-900 min-h-screen font-sans selection:bg-orange-500/30 overflow-x-clip">
                <HeroSection />
                <ProjectInfo />
                <Visuals />
                <MapAndCTA />
                <SPRouteNavigator />
            </main>
        </SPLayout>
    );
}
