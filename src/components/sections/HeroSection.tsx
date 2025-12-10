'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface Slide {
    id: string;
    key: string;
    image: string;
    gradient: string;
}

// Example slides - customize these for your app
const slides: Slide[] = [
    {
        id: '1',
        key: 'welcome',
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80",
        gradient: "from-blue-600/80 to-purple-600/80",
    },
    {
        id: '2',
        key: 'features',
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
        gradient: "from-purple-600/80 to-pink-600/80",
    }
];

const HeroSection = () => {
    const t = useTranslations('HeroSection');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const captionRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    const locale = useLocale();

    const animateSlide = (direction: 'next' | 'prev' | 'init' = 'init') => {
        if (isAnimating && direction !== 'init') return;
        setIsAnimating(true);

        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
        });

        if (direction !== 'init') {
            // Exit animation
            tl.to([titleRef.current, captionRef.current, buttonsRef.current], {
                opacity: 0,
                y: direction === 'next' ? -30 : 30,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.in'
            })
                .to(imageRef.current, {
                    scale: 1.1,
                    opacity: 0.5,
                    duration: 0.4,
                    ease: 'power2.in'
                }, '<');
        }

        // Enter animation
        tl.fromTo([titleRef.current, captionRef.current, buttonsRef.current],
            {
                opacity: 0,
                y: direction === 'next' ? 30 : direction === 'prev' ? -30 : 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                clearProps: 'all'
            }
        )
            .fromTo(imageRef.current,
                {
                    scale: direction === 'init' ? 1.2 : 1.1,
                    opacity: direction === 'init' ? 0 : 0.5
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out'
                },
                '<'
            );
    };

    const nextSlide = () => {
        if (isAnimating) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        animateSlide('next');
        resetAutoplay();
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        animateSlide('prev');
        resetAutoplay();
    };

    const goToSlide = (index: number) => {
        if (isAnimating || index === currentSlide) return;
        const direction = index > currentSlide ? 'next' : 'prev';
        setCurrentSlide(index);
        animateSlide(direction);
        resetAutoplay();
    };

    const resetAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
        }
        autoplayRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % slides.length;
                animateSlide('next');
                return next;
            });
        }, 5000);
    };

    useEffect(() => {
        animateSlide('init');
        resetAutoplay();

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, []);

    const current = slides[currentSlide];

    return (
        <section className="relative w-full h-[calc(100vh-20rem)] overflow-hidden bg-gray-900">
            {/* Background Image */}
            <div
                ref={imageRef}
                className="absolute inset-0 w-full h-full"
            >
                <img
                    src={current.image}
                    alt={t(`slides.${current.key}.title`)}
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${current.gradient}`} />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1
                            ref={titleRef}
                            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                        >
                            {t(`slides.${current.key}.title`)}
                        </h1>
                        <p
                            ref={captionRef}
                            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                        >
                            {t(`slides.${current.key}.caption`)}
                        </p>
                        <div
                            ref={buttonsRef}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link href="/dashboard" className="group relative px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-lg font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[160px] md:min-w-[200px] inline-flex items-center justify-center">
                                <span className="relative z-10">{t('buttons.getStarted')}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                                    {t('buttons.getStarted')}
                                </span>
                            </Link>
                            <button className="group relative px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[160px] md:min-w-[200px]">
                                <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                                    {t('buttons.learnMore')}
                                </span>
                                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={locale === 'ar' ? nextSlide : prevSlide}
                disabled={isAnimating}
                className="absolute left-4 md:left-8 top-[60%] md:top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={locale === 'ar' ? prevSlide : nextSlide}
                disabled={isAnimating}
                className="absolute right-4 md:right-8 top-[60%] md:top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        disabled={isAnimating}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'w-12 h-3 bg-white'
                            : 'w-3 h-3 bg-white/50 hover:bg-white/70 hover:scale-125'
                            } disabled:cursor-not-allowed`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 right-4 md:right-8 z-20 bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm md:text-base font-medium hidden md:block">
                <span className="font-bold">{currentSlide + 1}</span>
                <span className="mx-1">/</span>
                <span>{slides.length}</span>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 z-30" />
        </section>
    );
};

export default HeroSection;