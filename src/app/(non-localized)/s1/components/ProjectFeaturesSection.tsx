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
                <h2 className="mb-24 text-center text-5xl font-black uppercase leading-none tracking-tighter text-gray-900">
                    {title}
                </h2>
                <div className="mx-auto mt-12 grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-20">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.icon}-${item.label}-${item.value || "x"}-${idx}`}
                            className="group relative flex min-h-[160px] flex-col items-center justify-center rounded-xl bg-gray-50 px-6 pb-8 pt-16 transition-colors hover:bg-gray-100"
                        >
                            <div className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-500 group-hover:scale-110">
                                <ProjectIcon
                                    name={item.icon}
                                    className="h-12 w-12"
                                />
                            </div>
                            <p className="max-w-[200px] text-center text-xl font-bold text-gray-900 leading-tight">
                                {item.value || item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
