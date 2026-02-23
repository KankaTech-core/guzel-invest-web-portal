import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { faqsData } from "../data";

export function ProjectsFaqSection() {
    return (
        <ScrollRevealSection className="bg-gray-50 py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="reveal mb-16 text-center">
                    <h3 className="mb-4 text-3xl font-bold text-gray-900">
                        Sıkça Sorulan Sorular
                    </h3>
                    <p className="text-gray-500">
                        Alanya&apos;daki projelerimiz ve yatırım süreçleri hakkında merak ettikleriniz.
                    </p>
                </div>
                <div className="reveal-stagger space-y-4">
                    {faqsData.map((faq, index) => (
                        <div
                            key={index}
                            className="reveal rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
                        >
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-gray-900">
                                    <span>{faq.question}</span>
                                    <span className="text-orange-500 transition-transform group-open:rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-chevron-down"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">
                                    {faq.answer}
                                </p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollRevealSection>
    );
}
