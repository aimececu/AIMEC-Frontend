import React, { useState, useEffect, useCallback } from 'react';
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

  if (!slides.length) return null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-3 transition-all duration-300 group"
            aria-label="Slide anterior"
          >
            <Icon 
              name="FiChevronLeft" 
              className="text-white text-xl group-hover:scale-110 transition-transform" 
            />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-3 transition-all duration-300 group"
            aria-label="Slide siguiente"
          >
            <Icon 
              name="FiChevronRight" 
              className="text-white text-xl group-hover:scale-110 transition-transform" 
            />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-10 bg-black/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-white text-sm">
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
