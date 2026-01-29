"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does the auto-generation work?",
        answer: "Our engine analyzes your DOM structure and user interactions to automatically identify key steps. It effectively 'watches' you use your app and builds the tour in real-time, which you can then refine."
    },
    {
        question: "Can I customize the look and feel?",
        answer: "Absolutely. You can customize colors, fonts, border radii, and shadows to match your brand guidelines perfectly. We also support custom CSS for advanced styling needs."
    },
    {
        question: "Does it work on single page applications (SPAs)?",
        answer: "Yes, Product Tour is designed specifically for modern web apps. We support React, Vue, Angular, Svelte, and vanilla JS. It handles client-side routing out of the box."
    },
    {
        question: "What happens if I change my UI?",
        answer: "Our smart element detection is resilient to minor UI changes. If a selector breaks, we'll notify you, and our self-healing algorithm often suggests the new correct selector automatically."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes, you can build and test unlimited tours for free in development. You only pay when you're ready to publish to your production site."
    },
    {
        question: "How long until my first tour is live?",
        answer: "Typically under 5 minutes. Our AI understands your UI instantly, allowing you to generate a draft and publish it almost immediately."
    },
    {
        question: "Will this slow down my app?",
        answer: "No. Our lightweight script loads asynchronously and is optimized for peak performance, ensuring zero impact on your user experience."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#6b2c34] to-[#421d24] text-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">Questions & Answers</h2>
                    <p className="text-white/60">
                        If you have any other questions, please get in touch at <a href="mailto:support@producttour.app" className="text-white underline underline-offset-4 hover:text-white/80 transition-colors">support@producttour.app</a>.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-white/90 py-6 text-white">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
