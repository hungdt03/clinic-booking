import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import cn from '../../app/components';

interface SliderProps {
    children: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemsToShow = 4;
    const totalItems = React.Children.count(children);

    useEffect(() => {
        if (containerRef.current) {
            const firstChild = containerRef.current.firstElementChild as HTMLElement;
            if (firstChild) {
                setItemWidth(firstChild.offsetWidth);
            }
        }
    }, [children]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalItems - itemsToShow));
    };

    return (
        <div className="relative w-full">
            <div className='p-1 px-2 overflow-hidden w-full'>
                <div
                    ref={containerRef}
                    className="flex gap-6 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex * (itemWidth + 18))}px)` }}
                >
                    {React.Children.map(children, (child) => (
                        <div className="flex-shrink-0" style={{
                            width: 'calc(25% - 18px)'
                        }}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            {totalItems > itemsToShow && (
                <>
                    <button
                        onClick={handlePrev}
                        className={cn('absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-xl border-[1px] border-gray-200 text-black px-4 py-2', currentIndex === 0 ? 'cursor-not-allowed bg-gray-500 bg-opacity-25' : 'hover:bg-primary hover:text-white transition-all duration-300 ease-in-out')}
                        disabled={currentIndex === 0}
                    >
                        <FontAwesomeIcon className='text-[13px]' icon={faChevronLeft} />
                    </button>
                    <button
                        onClick={handleNext}
                        className={cn('absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-xl border-[1px] border-gray-200 text-black px-4 py-2', currentIndex >= totalItems - itemsToShow ? 'cursor-not-allowed bg-gray-500 bg-opacity-25' : 'hover:bg-primary hover:text-white transition-all duration-300 ease-in-out')}
                        disabled={currentIndex >= totalItems - itemsToShow}
                    >
                        <FontAwesomeIcon className='text-[13px]' icon={faChevronRight} />
                    </button>
                </>
            )}
        </div>
    );
};

export default Slider;
