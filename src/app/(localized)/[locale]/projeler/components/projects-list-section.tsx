import { MoveRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { projectsData } from "../data";

export function ProjectsListSection({ locale }: { locale: string }) {
    return (
        <ScrollRevealSection className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 space-y-32 sm:px-6">
                {projectsData.map((project, index) => (
                    <div
                        key={project.id}
                        className={`flex flex-col items-center gap-12 ${project.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
                    >
                        <div className="reveal-scale group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm md:w-1/2">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                        </div>
                        <div className="reveal w-full space-y-6 md:w-1/2">
                            <h4 className="text-4xl font-bold text-gray-900">
                                {project.title}
                            </h4>
                            <p className="text-lg leading-relaxed text-gray-600">
                                {project.description}
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                {project.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-orange-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-2">
                                <Link
                                    href={`/${locale}/portfoy`} // Directing to portfoy as placeholder
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95"
                                >
                                    Detayları İncele
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollRevealSection>
    );
}
