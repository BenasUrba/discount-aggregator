import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "./ProductCard";

export default function Carousel({ products }) {
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const [sliderRef, slider] = useKeenSlider(
        loaded ?
            {
                slides: {
                    perView: 5,
                    spacing: 12,
                },
                breakpoints: {
                    "(max-width: 1024px)": {
                        slides: {perView: 4, spacing: 12},
                    },
                    "(max-width: 768px)": {
                        slides: {perView: 2, spacing: 8},
                    },
                    "(max-width: 480px)": {
                        slides: {perView: 1, spacing: 4},
                    },
                },
                loop: false,
                slideChanged(s) {
                    setCurrentSlide(s.track.details.rel);
                },
    } : null);

    useEffect(() => {
        if (!loaded) return;

        const timeout = setTimeout(() => {
            slider.current?.update();
            setReady(true);
        }, 50);

        return () => clearTimeout(timeout);
    }, [loaded, products]);

    if (!loaded) return null;

    const perView = slider.current?.options.slides?.perView || 1;
    const totalSlides = products.length;

    return (
        <div className="relative">
                <p className="m-4 text-lg font-semibold text-gray-800 tracking-tight inline-block after:block after:h-1 after:bg-gray-800 after:rounded after:mt-1">
                    Top Product Discounts
                </p>
            <div ref={sliderRef} className={`keen-slider transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
                {products.map((product) => (
                    <div key={product.id} className="keen-slider__slide">
                        <ProductCard product={product}/>
                    </div>
                ))}
            </div>
            {ready && (
                <>
                    <button
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white shadow p-2 rounded transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => slider.current?.prev()}
                        disabled={currentSlide === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white shadow p-2 rounded transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => slider.current?.next()}
                        disabled={currentSlide >= totalSlides - perView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}

