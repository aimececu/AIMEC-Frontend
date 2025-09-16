import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from './Icon';

const HeroSlider = ({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000, 
  showArrows = true, 
  showDots = true,
  className = "" 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentSlide, autoPlay, interval]);

  // Pause auto-play on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || !isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentSlide, autoPlay, interval, isPaused]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [slides.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentSlide, isTransitioning]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!slides.length) return null;

  return (
    <div 
      ref={sliderRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ isolation: 'isolate' }}
    >
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            {slide.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                {/* Overlay */}
                {slide.overlay && (
                  <div 
                    className={`absolute inset-0 ${slide.overlay}`}
                  />
                )}
              </div>
            )}

            {/* Content Container */}
            <div className={`relative z-20 h-full flex items-center ${slide.contentPosition || 'justify-center'}`}>
              <div className={`container mx-auto px-4 ${slide.contentAlignment || 'text-center'}`}>
                {/* Glass Effect Container */}
                {slide.glassEffect && (
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative z-30">
                    <HeroSlideContent slide={slide} />
                  </div>
                )}

                {/* Regular Content */}
                {!slide.glassEffect && (
                  <div className="relative z-30">
                    <HeroSlideContent slide={slide} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 rounded-full p-2 md:p-3 transition-all duration-300 group touch-manipulation"
            aria-label="Slide anterior"
            disabled={isTransitioning}
          >
            <Icon 
              name="FiChevronLeft" 
              className="text-white text-lg md:text-xl group-hover:scale-110 transition-transform" 
            />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 rounded-full p-2 md:p-3 transition-all duration-300 group touch-manipulation"
            aria-label="Slide siguiente"
            disabled={isTransitioning}
          >
            <Icon 
              name="FiChevronRight" 
              className="text-white text-lg md:text-xl group-hover:scale-110 transition-transform" 
            />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 bg-black/30 backdrop-blur-sm border border-white/40 rounded-full px-2 py-1 md:px-3 md:py-1 text-white text-xs md:text-sm font-medium">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

// Separate component for slide content
const HeroSlideContent = ({ slide }) => {
  const navigate = useNavigate();
  // Si el slide tiene un layout personalizado, usarlo
  if (slide.layout === 'split') {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center mx-auto ${slide.contentMaxWidth || 'max-w-6xl'}`}>
        {/* Columna izquierda - Imagen */}
        {slide.internalImage && (
          <div className={`order-1 flex justify-center items-center ${slide.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
            <img 
              src={slide.internalImage} 
              alt={slide.internalImageAlt || 'Slide image'}
              className={`w-full h-auto ${slide.internalImageClassName || 'max-h-96 md:max-h-[500px] rounded-lg shadow-2xl'} ${slide.removeBackground ? 'mix-blend-multiply' : ''}`}
            />
          </div>
        )}
        
        {/* Columna derecha - Contenido */}
        <div className={`order-2 ${slide.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'} text-center lg:text-center flex flex-col justify-center items-center`}>
          <div className="space-y-6">
            {/* Main Title */}
            {slide.title && (
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight ${slide.titleClassName || ''}`}>
                {slide.title}
              </h1>
            )}

            {/* Subtitle */}
            {slide.subtitle && (
              <p className={`text-xl md:text-2xl text-white/90 leading-relaxed ${slide.subtitleClassName || ''}`}>
                {slide.subtitle}
              </p>
            )}

            {/* Description */}
            {slide.description && (
              <p className={`text-lg text-white/80 leading-relaxed ${slide.descriptionClassName || ''}`}>
                {slide.description}
              </p>
            )}

            {/* Buttons */}
            {slide.buttons && slide.buttons.length > 0 && (
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${slide.buttonsPosition || 'mt-8'} relative z-40`}>
                {slide.buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || 'primary'}
                    size={button.size || 'lg'}
                    onClick={button.link ? () => navigate(button.link) : button.onClick}
                    className={`${button.className || ''} relative z-50`}
                    icon={button.icon}
                    fullWidth={button.fullWidth}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Layout por defecto (centrado)
  return (
    <div className={`space-y-6 text-center mx-auto ${slide.contentMaxWidth || 'max-w-4xl'}`}>
      {/* Main Title */}
      {slide.title && (
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight ${slide.titleClassName || ''}`}>
          {slide.title}
        </h1>
      )}

      {/* Subtitle */}
      {slide.subtitle && (
        <p className={`text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed ${slide.subtitleClassName || ''}`}>
          {slide.subtitle}
        </p>
      )}

      {/* Description */}
      {slide.description && (
        <p className={`text-lg md:text-xl text-white/80 leading-relaxed ${slide.descriptionClassName || ''}`}>
          {slide.description}
        </p>
      )}

      {/* Internal Image */}
      {slide.internalImage && (
        <div className={`flex justify-center ${slide.internalImagePosition || 'mt-8'}`}>
          <img 
            src={slide.internalImage} 
            alt={slide.internalImageAlt || 'Slide image'}
            className={`max-w-full h-auto ${slide.internalImageClassName || 'max-h-64 md:max-h-96'} ${slide.removeBackground ? 'mix-blend-multiply' : ''}`}
          />
        </div>
      )}

      {/* Buttons */}
      {slide.buttons && slide.buttons.length > 0 && (
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${slide.buttonsPosition || 'mt-8'} relative z-40`}>
          {slide.buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'primary'}
              size={button.size || 'lg'}
              onClick={button.link ? () => navigate(button.link) : button.onClick}
              className={`${button.className || ''} relative z-50`}
              icon={button.icon}
              fullWidth={button.fullWidth}
            >
              {button.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
