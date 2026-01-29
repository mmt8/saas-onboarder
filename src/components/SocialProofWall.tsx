"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
    id: string;
    name: string;
    handle: string;
    content: string;
    avatar: string;
    verified?: boolean;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Abhishek Vijayvergiya",
        handle: "@abvijayvergiya",
        content: "I'm seeing more and more product videos (even by Fortune 500) now being created in @producttour. Being a user myself, and with 5+ years of content marketing background, this is definitely one of the best tour apps that I have used. Great work!",
        avatar: "https://i.pravatar.cc/150?u=abvijayvergiya",
        verified: true,
    },
    {
        id: "2",
        name: "Sveta Bay",
        handle: "@sveta_bay",
        content: "The only working method to boost your launch on socials is to use producttour. I've never got so many link clicks before. You're making magic.",
        avatar: "https://i.pravatar.cc/150?u=sveta_bay",
    },
    {
        id: "3",
        name: "Mike Lee",
        handle: "@mikelikesdesign",
        content: "I'm currently putting together product demos and I needed a simple app where I can zoom in on specific parts. @producttour is exactly what I was looking for, instant purchase!",
        avatar: "https://i.pravatar.cc/150?u=mikelikesdesign",
    },
    {
        id: "4",
        name: "No I Diaz",
        handle: "@ded",
        content: "Just got my license key for @producttour! This tool is truly a game changer for creating delightful demos!",
        avatar: "https://i.pravatar.cc/150?u=ded",
        verified: true,
    },
    {
        id: "5",
        name: "Sukh",
        handle: "@thisissukh_",
        content: "Never bought something so fast - @producttour recordings look amaazing! 🌟 ✨",
        avatar: "https://i.pravatar.cc/150?u=thisissukh_",
    },
    {
        id: "6",
        name: "Evan Stewart",
        handle: "@heyecs",
        content: "Tried out @producttour for our new feature video, and it was an *instant* purchase. Fantastic work!",
        avatar: "https://i.pravatar.cc/150?u=heyecs",
    },
    {
        id: "7",
        name: "Gino",
        handle: "@ginosup",
        content: "Every now and then, you stumble upon true gems, and @producttour for macOS is undoubtedly one of them! ☀️",
        avatar: "https://i.pravatar.cc/150?u=ginosup",
        verified: true,
    },
    {
        id: "8",
        name: "cn80",
        handle: "@cn8011",
        content: "This is awesome, charge double plz! This is far more useful than Camtasia & other screen recorders.",
        avatar: "https://i.pravatar.cc/150?u=cn8011",
    },
    {
        id: "9",
        name: "Stephan Meijer",
        handle: "@meijer_s",
        content: "OMG. @producttour is 🤯. Took me ~ 5 minutes to create a nice looking video that I could share with my coworkers.",
        avatar: "https://i.pravatar.cc/150?u=meijer_s",
    },
    {
        id: "10",
        name: "Zigpoll",
        handle: "@zigpoll",
        content: "If you have a mac Product Tour is a focused and very well designed tool. Installed it last week and it has already saved so much time!",
        avatar: "https://i.pravatar.cc/150?u=zigpoll",
        verified: true,
    },
    {
        id: "11",
        name: "homanp",
        handle: "@pelaseyed",
        content: "Best thing ever, saved me half a day!",
        avatar: "https://i.pravatar.cc/150?u=pelaseyed",
    },
    {
        id: "12",
        name: "Andrew Daniels",
        handle: "@design_nocodeio",
        content: "I just used @producttour for the first time. It is incredible. I'm going to record everything with this now.",
        avatar: "https://i.pravatar.cc/150?u=design_nocodeio",
        verified: true,
    }
];

export function SocialProofWall() {
    return (
        <section className="py-24 px-6 md:px-8 bg-[#0A0A0B]">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                        Loved by product teams.
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-sans">
                        See what others are creating with Product Tour.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="break-inside-avoid bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-white text-sm">{testimonial.name}</span>
                                        {testimonial.verified && (
                                            <span className="text-blue-400 text-[10px]">✓</span>
                                            // You might want to use a Lucide icon here for better quality
                                        )}
                                    </div>
                                    <span className="text-xs text-white/40">{testimonial.handle}</span>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed font-sans">
                                {testimonial.content.split(/(\@\w+)/).map((part, i) => (
                                    part.startsWith('@') ? (
                                        <span key={i} className="text-blue-400 font-medium">{part}</span>
                                    ) : (
                                        part
                                    )
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
