"use client";

import { useState, useEffect, useCallback } from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    formatLabel?: (value: number) => string;
}

export function RangeSlider({
    min,
    max,
    step = 1,
    value,
    onChange,
    formatLabel = (v) => v.toString(),
}: RangeSliderProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const getPercent = useCallback(
        (v: number) => ((v - min) / (max - min)) * 100,
        [min, max]
    );

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), localValue[1] - step);
        const newValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), localValue[0] + step);
        const newValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const minPercent = getPercent(localValue[0]);
    const maxPercent = getPercent(localValue[1]);

    return (
        <div className="space-y-4">
            {/* Labels */}
            <div className="flex justify-between text-sm font-medium text-gray-700">
                <span className="bg-gray-100 px-3 py-1 rounded-md">{formatLabel(localValue[0])}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">{formatLabel(localValue[1])}</span>
            </div>

            {/* Slider Track */}
            <div className="relative h-6">
                <div className="slider-track-base" />
                <div
                    className="slider-track-range"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`,
                    }}
                />

                {/* Min Thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[0]}
                    onChange={handleMinChange}
                    className="slider-input"
                    style={{ zIndex: localValue[0] > max - (max - min) / 10 ? 35 : 30 }}
                />

                {/* Max Thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[1]}
                    onChange={handleMaxChange}
                    className="slider-input"
                    style={{ zIndex: localValue[1] < min + (max - min) / 10 ? 35 : 30 }}
                />
            </div>
        </div>
    );
}
