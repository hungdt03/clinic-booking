import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
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
    const [itemsToShow, setItemsToShow] = useState(4);
    const totalItems = React.Children.count(children);
    const startPos = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        const updateItemsToShow = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setItemsToShow(4); 
            } else if (width >= 1024) {
                setItemsToShow(4); 
            } else if (width >= 768) {
                setItemsToShow(3); 
            } else  {
                setItemsToShow(1);
                setItemWidth(window.innerWidth * 0.7); 
            } 
        };

        updateItemsToShow();

        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    useEffect(() => {
        if (containerRef.current && itemsToShow > 1) {
            const firstChild = containerRef.current.firstElementChild as HTMLElement;
            if (firstChild) {
                setItemWidth(firstChild.offsetWidth);
            }
        }
    }, [children, itemsToShow]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalItems - itemsToShow));
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        startPos.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current) return;
        const currentPosition = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const distance = startPos.current - currentPosition;

        // Check if enough distance is dragged to move to the next or previous slide
        if (distance > 50) {
            handleNext();
            isDragging.current = false;
        } else if (distance < -50) {
            handlePrev();
            isDragging.current = false;
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div className="relative w-full" 
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onTouchStart={handleMouseDown}
             onTouchMove={handleMouseMove}
             onTouchEnd={handleMouseUp}>
            <div className='p-1 px-2 overflow-hidden w-full'>
                <div
                    ref={containerRef}
                    className="flex gap-6 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex * (itemWidth + 18))}px)` }}
                >
                    {React.Children.map(children, (child) => (
                        <div
                            className="flex-shrink-0"
                            style={{
                                width: window.innerWidth < 640 ? '70%' : `calc(${100 / itemsToShow}% - 18px)`
                            }}
                        >
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
