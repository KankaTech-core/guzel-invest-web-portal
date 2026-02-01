"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface TagInputProps {
    selectedTags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    className?: string;
}

const PRESET_COLORS = [
    "#EC6803", // Orange (brand)
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#10B981", // Green
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#6B7280", // Gray
];

export function TagInput({ selectedTags, onTagsChange, className }: TagInputProps) {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch available tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch("/api/admin/tags");
                if (res.ok) {
                    const data = await res.json();
                    setAvailableTags(data.tags || []);
                }
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };
        fetchTags();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsCreating(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTagSelect = (tag: Tag) => {
        if (!selectedTags.find((t) => t.id === tag.id)) {
            onTagsChange([...selectedTags, tag]);
        }
        setIsOpen(false);
    };

    const handleTagRemove = (tagId: string) => {
        onTagsChange(selectedTags.filter((t) => t.id !== tagId));
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
            });

            if (res.ok) {
                const data = await res.json();
                const newTag = data.tag;
                setAvailableTags((prev) => [...prev, newTag]);
                onTagsChange([...selectedTags, newTag]);
                setNewTagName("");
                setIsCreating(false);
            }
        } catch (error) {
            console.error("Failed to create tag:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const unselectedTags = availableTags.filter(
        (tag) => !selectedTags.find((t) => t.id === tag.id)
    );

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                    >
                        {tag.name}
                        <button
                            onClick={() => handleTagRemove(tag.id)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Dropdown Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Etiket Ekle
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    {!isCreating ? (
                        <>
                            {unselectedTags.length > 0 ? (
                                <div className="max-h-48 overflow-y-auto">
                                    {unselectedTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => handleTagSelect(tag)}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            <span className="text-sm text-gray-700">{tag.name}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="px-4 py-2 text-sm text-gray-400">
                                    Tüm etiketler seçili
                                </p>
                            )}
                            <hr className="my-2 border-gray-100" />
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Yeni Etiket Oluştur
                            </button>
                        </>
                    ) : (
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Etiket Adı
                                </label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Yeni etiket..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">
                                    Renk
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewTagColor(color)}
                                            className={cn(
                                                "w-6 h-6 rounded-full transition-transform",
                                                newTagColor === color && "ring-2 ring-offset-2 ring-gray-400 scale-110"
                                            )}
                                            style={{ backgroundColor: color }}
                                        >
                                            {newTagColor === color && (
                                                <Check className="w-4 h-4 text-white mx-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    disabled={!newTagName.trim() || isLoading}
                                    className="flex-1 px-3 py-2 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                >
                                    {isLoading ? "..." : "Oluştur"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
