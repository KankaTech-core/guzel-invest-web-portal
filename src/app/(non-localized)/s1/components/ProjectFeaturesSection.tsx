import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1RibbonItem } from "../types";

interface ProjectFeaturesSectionProps {
    title?: string;
    items: S1RibbonItem[];
}

export const ProjectFeaturesSection = ({
    title = "Genel Özellikler",
    items,
}: ProjectFeaturesSectionProps) => {
    if (!items.length) {
        return null;
    }

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="mb-10 text-center text-3xl font-black uppercase leading-[1.08] tracking-[-0.01em] text-gray-900">
                    {title}
                </h2>
                <div className="mx-auto flex max-w-[700px] flex-wrap justify-center gap-x-10 gap-y-7">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.icon}-${item.label}-${item.value || "x"}-${idx}`}
                            className="w-[140px] text-center"
                        >
                            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 bg-gray-50 shadow-sm">
                                <ProjectIcon
                                    name={item.icon}
                                    className="h-8 w-8 text-gray-700"
                                />
                            </div>
                            <p className="text-sm font-bold text-gray-700">
                                {item.value || item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
