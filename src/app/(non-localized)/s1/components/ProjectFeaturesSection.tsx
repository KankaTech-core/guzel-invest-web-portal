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
        <section className="bg-white py-24">
            <div className="mx-auto max-w-[1440px] px-6">
                <h2 className="mb-16 text-center text-5xl font-black uppercase leading-none tracking-tighter text-gray-900">
                    {title}
                </h2>
                <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.icon}-${item.label}-${item.value || "x"}-${idx}`}
                            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-3 hover:border-orange-300 hover:shadow-[0_30px_60px_rgba(236,104,3,0.15)]"
                        >
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-50/30 blur-2xl transition-all group-hover:bg-orange-100/50" />

                            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-orange-50/80 text-orange-600 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <ProjectIcon
                                    name={item.icon}
                                    className="h-16 w-16"
                                />
                            </div>
                            <p className="max-w-[200px] text-center text-2xl font-black text-gray-900 leading-tight tracking-tight">
                                {item.value || item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
