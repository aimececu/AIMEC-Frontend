# HeroSlider Component

Un componente de slider hero completamente personalizable con múltiples slides, navegación automática y manual, efectos glass opcionales, layouts divididos, y soporte móvil.

## Características

- ✅ **Múltiples slides** con transiciones suaves
- ✅ **Auto-play** con intervalo configurable
- ✅ **Navegación manual** con flechas y dots
- ✅ **Efecto glass** opcional
- ✅ **Layouts flexibles**: centrado y dividido (split)
- ✅ **Imágenes de fondo** con overlays
- ✅ **Imágenes internas** posicionables (izquierda/derecha)
- ✅ **Botones personalizables** con múltiples variantes
- ✅ **Responsive** y optimizado para móvil
- ✅ **Pausa en hover** para mejor UX
- ✅ **Contador de slides** visible
- ✅ **Posicionamiento flexible** del contenido

## Uso Básico

```jsx
import { HeroSlider } from '../../components/ui/components';

const slides = [
  {
    title: "Título Principal",
    subtitle: "Subtítulo",
    description: "Descripción del slide",
    backgroundImage: "url-de-la-imagen.jpg",
    buttons: [
      {
        text: "Botón Principal",
        variant: "white",
        link: "/ruta"
      }
    ]
  }
];

<HeroSlider
  slides={slides}
  autoPlay={true}
  interval={5000}
/>
```

## Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `slides` | Array | `[]` | Array de objetos de slides |
| `autoPlay` | Boolean | `true` | Activar reproducción automática |
| `interval` | Number | `5000` | Intervalo en ms entre slides |
| `showArrows` | Boolean | `true` | Mostrar flechas de navegación |
| `showDots` | Boolean | `true` | Mostrar dots de navegación |
| `className` | String | `""` | Clases CSS adicionales |

## Estructura de un Slide

### Propiedades Básicas
```javascript
{
  title: "Título del slide",
  subtitle: "Subtítulo opcional",
  description: "Descripción del slide",
  backgroundImage: "url-de-la-imagen-de-fondo",
  overlay: "bg-gradient-to-r from-primary-600/80 to-primary-700/80",
  glassEffect: true, // Efecto glass opcional
  buttons: [
    {
      text: "Texto del botón",
      variant: "white", // white, primary, outline, etc.
      size: "lg",
      link: "/ruta",
      className: "clases-adicionales"
    }
  ]
}
```

### Layout Dividido (Split)
```javascript
{
  title: "Título del slide",
  subtitle: "Subtítulo",
  description: "Descripción",
  backgroundImage: "url-de-la-imagen-de-fondo",
  overlay: "bg-gradient-to-r from-blue-600/80 to-blue-800/80",
  layout: "split", // Activa el layout dividido
  internalImage: "url-de-la-imagen-interna",
  imagePosition: "left", // "left" o "right"
  buttons: [...]
}
```

## Ejemplos

### 1. Slide Centrado (Por defecto)
```javascript
{
  title: "Componentes Industriales",
  subtitle: "de Alta Calidad",
  description: "Especialistas en instalación y programación de componentes industriales.",
  backgroundImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  overlay: "bg-gradient-to-r from-primary-600/80 to-primary-700/80",
  buttons: [
    {
      text: "Ver Catálogo",
      variant: "white",
      link: "/catalogo"
    }
  ]
}
```

### 2. Layout Dividido - Imagen a la Izquierda
```javascript
{
  title: "Automatización Industrial",
  subtitle: "Tecnología de Vanguardia",
  description: "Implementamos sistemas de automatización avanzados que optimizan procesos industriales.",
  backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
  overlay: "bg-gradient-to-r from-blue-600/80 to-blue-800/80",
  layout: "split",
  internalImage: "https://images.unsplash.com/photo-1551434678-e076c223a692",
  imagePosition: "left", // Imagen a la izquierda, texto a la derecha
  buttons: [
    {
      text: "Nuestros Servicios",
      variant: "white",
      link: "/servicios"
    }
  ]
}
```

### 3. Layout Dividido - Imagen a la Derecha
```javascript
{
  title: "Soporte Técnico 24/7",
  subtitle: "Siempre a tu Lado",
  description: "Nuestro equipo de expertos está disponible las 24 horas.",
  backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
  overlay: "bg-gradient-to-r from-green-600/80 to-green-800/80",
  layout: "split",
  internalImage: "https://images.unsplash.com/photo-1551434678-e076c223a692",
  imagePosition: "right", // Imagen a la derecha, texto a la izquierda
  buttons: [
    {
      text: "Contactar Soporte",
      variant: "white",
      link: "/soporte"
    }
  ]
}
```

### 4. Efecto Glass
```javascript
{
  title: "Tecnología Avanzada",
  subtitle: "Innovación Constante",
  description: "Utilizamos las últimas tecnologías para ofrecer soluciones de vanguardia.",
  backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
  overlay: "bg-gradient-to-r from-purple-600/80 to-purple-800/80",
  glassEffect: true, // Activa el efecto glass
  buttons: [
    {
      text: "Conocer Más",
      variant: "white",
      link: "/tecnologia"
    }
  ]
}
```

## Configuración Avanzada

### Personalización de Clases CSS
```javascript
{
  title: "Título Personalizado",
  titleClassName: "text-5xl font-black", // Clases personalizadas para el título
  subtitleClassName: "text-2xl font-light", // Clases personalizadas para el subtítulo
  descriptionClassName: "text-lg leading-relaxed", // Clases personalizadas para la descripción
  internalImageClassName: "max-h-80 rounded-xl shadow-2xl", // Clases personalizadas para la imagen
  contentMaxWidth: "max-w-5xl", // Ancho máximo del contenido
  buttonsPosition: "mt-12", // Posición personalizada de los botones
  internalImagePosition: "mt-10" // Posición personalizada de la imagen
}
```

### Posicionamiento del Contenido
```javascript
{
  // Para layout centrado
  contentPosition: "justify-start", // justify-start, justify-center, justify-end
  contentAlignment: "text-left", // text-left, text-center, text-right
  
  // Para layout dividido
  layout: "split",
  imagePosition: "left", // "left" o "right"
}
```

## Responsive

El componente es completamente responsive:

- **Móvil**: Layout de una columna, botones apilados verticalmente
- **Tablet**: Layout adaptativo según el tipo de slide
- **Desktop**: Layout completo con todas las funcionalidades

### Breakpoints
- `sm`: 640px+ (botones en fila)
- `lg`: 1024px+ (layout dividido activo)

## Accesibilidad

- Navegación por teclado
- Etiquetas ARIA para botones
- Contraste adecuado en textos
- Indicadores visuales de estado

## Notas Importantes

1. **Imágenes**: Usa URLs de imágenes optimizadas para mejor rendimiento
2. **Overlays**: Los overlays mejoran la legibilidad del texto sobre imágenes
3. **Layout Split**: Requiere `internalImage` para funcionar correctamente
4. **Botones**: Los botones se centran automáticamente en layout centrado
5. **Auto-play**: Se pausa automáticamente al hacer hover
6. **Transiciones**: Suaves y optimizadas para mejor UX

## Personalización de Estilos

Puedes personalizar los estilos usando las clases CSS personalizables:

```javascript
{
  titleClassName: "text-6xl font-black text-white",
  subtitleClassName: "text-3xl font-light text-white/90",
  descriptionClassName: "text-xl text-white/80 leading-relaxed",
  internalImageClassName: "w-full h-auto max-h-[600px] rounded-2xl shadow-2xl",
  contentMaxWidth: "max-w-7xl",
  buttonsPosition: "mt-10",
  internalImagePosition: "mt-8"
}
```
