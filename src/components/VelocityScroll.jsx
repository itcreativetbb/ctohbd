import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VelocityScroll = ({
    items = [], // Renamed from texts to items for clarity (backwards compat supported if mapped)
    defaultVelocity = 100, // renamed prop for clarity
    className = '',
    damping = 50,
    stiffness = 400,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName = '',
    scrollerClassName = '',
    parallaxStyle = {},
    scrollerStyle = {}
}) => {
    const containerRef = useRef([]);
    const scrollerRef = useRef([]);
    const copyRefs = useRef([]);

    // Support single row for now as per ticker requirement
    const rows = [items];

    // State to track width/copies for each row
    const [rowConfig, setRowConfig] = useState([]);

    // Mutable animation state
    const animationState = useRef({
        baseX: [],
        scrollVelocity: 0,
        smoothVelocity: 0,
        velocityFactor: 0,
        directionFactors: [],
        lastScrollY: 0,
        lastTime: 0,
        rafId: null
    });

    // Initialize state arrays on mount or items change
    useEffect(() => {
        animationState.current.baseX = new Array(rows.length).fill(0);
        animationState.current.directionFactors = new Array(rows.length).fill(1);
    }, [items.length]);

    // Calculate copies needed to fill screen
    useEffect(() => {
        const calculateCopies = () => {
            const newConfig = rows.map((_, index) => {
                if (!copyRefs.current[index] || !containerRef.current[index]) {
                    return { singleWidth: 0, copies: 10 };
                }

                const singleCopyWidth = copyRefs.current[index].offsetWidth;
                const containerWidth = containerRef.current[index].offsetWidth;
                const viewportWidth = window.innerWidth;

                if (singleCopyWidth === 0) return { singleWidth: 0, copies: 2 };

                const effectiveWidth = Math.max(containerWidth, viewportWidth);
                const minCopies = Math.ceil((effectiveWidth * 2) / singleCopyWidth);
                const optimalCopies = Math.max(minCopies, 6); // Reduced count for cards to avoid heavy DOM

                return { singleWidth: singleCopyWidth, copies: optimalCopies };
            });
            setRowConfig(newConfig);
        };

        const timer = setTimeout(calculateCopies, 100);
        window.addEventListener('resize', calculateCopies);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateCopies);
        }
    }, [items]);

    useEffect(() => {
        const state = animationState.current;

        const updateSmoothVelocity = () => {
            const dampingFactor = damping / 1000;
            const stiffnessFactor = stiffness / 1000;

            const velocityDiff = state.scrollVelocity - state.smoothVelocity;
            state.smoothVelocity += velocityDiff * stiffnessFactor;
            state.smoothVelocity *= 1 - dampingFactor;
        };

        const updateVelocityFactor = () => {
            const { input, output } = velocityMapping;
            const inputRange = input[1] - input[0];
            const outputRange = output[1] - output[0];

            let normalizedVelocity = (Math.abs(state.smoothVelocity) - input[0]) / inputRange;
            normalizedVelocity = Math.max(0, Math.min(1, normalizedVelocity));

            state.velocityFactor = output[0] + normalizedVelocity * outputRange;
            if (state.smoothVelocity < 0) state.velocityFactor *= -1;
        };

        const animate = (currentTime) => {
            if (state.lastTime === 0) state.lastTime = currentTime;
            const delta = currentTime - state.lastTime;
            state.lastTime = currentTime;

            updateSmoothVelocity();
            updateVelocityFactor();

            rows.forEach((_, index) => {
                const rowScroller = scrollerRef.current[index];
                if (!rowScroller) return;

                const baseVelocity = index % 2 !== 0 ? -defaultVelocity : defaultVelocity;
                let moveBy = (state.directionFactors[index] || 1) * baseVelocity * (delta / 1000);

                if (state.velocityFactor < 0) {
                    state.directionFactors[index] = -1;
                } else if (state.velocityFactor > 0) {
                    state.directionFactors[index] = 1;
                }

                moveBy += (state.directionFactors[index] || 1) * moveBy * state.velocityFactor;

                state.baseX[index] = (state.baseX[index] || 0) + moveBy;

                const singleWidth = rowConfig[index]?.singleWidth || 0;
                if (singleWidth > 0) {
                    const min = -singleWidth;
                    const max = 0;
                    const v = state.baseX[index];
                    const rangeVal = max - min;
                    const mod = (((v - min) % rangeVal) + rangeVal) % rangeVal;
                    const finalVal = mod + min;

                    rowScroller.style.transform = `translateX(${finalVal}px)`;
                }
            });

            state.rafId = requestAnimationFrame(animate);
        };

        const updateScrollVelocity = () => {
            const currentScrollY = window.scrollY;
            const currentTime = performance.now();
            const timeDelta = currentTime - state.lastTime;

            if (timeDelta > 0) {
                const scrollDelta = currentScrollY - state.lastScrollY;
                state.scrollVelocity = (scrollDelta / timeDelta) * 1000;
            }
            state.lastScrollY = currentScrollY;
        };

        state.rafId = requestAnimationFrame(animate);

        const trigger = ScrollTrigger.create({
            onUpdate: updateScrollVelocity,
            start: 0,
            end: "max"
        });

        return () => {
            if (state.rafId) cancelAnimationFrame(state.rafId);
            if (trigger) trigger.kill();
        };
    }, [items, defaultVelocity, damping, stiffness, velocityMapping, rowConfig]);

    return (
        <section className="width-full overflow-hidden">
            {rows.map((rowItems, index) => (
                <div
                    key={index}
                    ref={el => containerRef.current[index] = el}
                    className={`${parallaxClassName} relative overflow-hidden`}
                    style={parallaxStyle}
                >
                    <div
                        ref={el => scrollerRef.current[index] = el}
                        className={`${scrollerClassName} flex whitespace-nowrap`}
                        style={scrollerStyle}
                    >
                        {/* We render a BLOCK of items, and then replicate THAT block */}
                        {/* Original logic replicated 'text' N times. 
                             Here we replicate the entire list of items N times to maintain sequence */}
                        {Array.from({ length: rowConfig[index]?.copies || 6 }).map((_, copyIndex) => (
                            <div
                                key={copyIndex}
                                className="flex flex-shrink-0"
                                ref={copyIndex === 0 ? (el => copyRefs.current[index] = el) : null}
                            >
                                {rowItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className={className}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default VelocityScroll;
