// Productos de Siemens - Datos reales de automatización industrial
export const siemensProducts = [
  // ===== CONTROLADORES PLC =====
  {
    id: 'siemens-s7-1200-basic',
    name: 'PLC SIMATIC S7-1200 Basic',
    description: 'Controlador lógico programable compacto para aplicaciones básicas de automatización',
    category: 'controllers',
    subcategory: 'plc',
    brand: 'siemens',
    series: 'S7-1200',
    price: 1299.99,
    originalPrice: 1499.99,
    stock: 25,
    image: 'siemens-s7-1200-basic',
    rating: 4.8,
    
    // Especificaciones técnicas
    specifications: {
      cpu: 'CPU 1214C DC/DC/DC',
      memory: '100 KB de memoria de trabajo',
      digitalInputs: '14 entradas digitales',
      digitalOutputs: '10 salidas digitales',
      analogInputs: '2 entradas analógicas',
      communication: 'Ethernet integrado',
      powerSupply: '24V DC',
      operatingTemperature: '-20°C a +60°C',
      protection: 'IP20'
    },
    
    // Accesorios disponibles
    accessories: [
      {
        id: 'siemens-s7-1200-expansion-1',
        name: 'Módulo de Expansión DI/DO',
        description: 'Módulo de expansión con 8 entradas y 8 salidas digitales',
        price: 299.99,
        image: 'siemens-expansion-di-do'
      },
      {
        id: 'siemens-s7-1200-expansion-2',
        name: 'Módulo de Expansión AI/AO',
        description: 'Módulo de expansión con 4 entradas y 2 salidas analógicas',
        price: 399.99,
        image: 'siemens-expansion-ai-ao'
      },
      {
        id: 'siemens-s7-1200-communication',
        name: 'Módulo de Comunicación Profinet',
        description: 'Módulo adicional para comunicación Profinet',
        price: 199.99,
        image: 'siemens-communication-profinet'
      }
    ],
    

    
    // Información adicional
    features: [
      'Programación con TIA Portal',
      'Comunicación Ethernet integrada',
      'Interfaz de usuario integrada',
      'Soporte para HMI básico',
      'Diagnóstico avanzado'
    ],
    
    applications: [
      'Automatización de máquinas',
      'Control de procesos',
      'Sistemas de transporte',
      'Equipos de empaquetado'
    ],
    
    certifications: ['CE', 'UL', 'CSA'],
    warranty: '2 años',
    leadTime: '1-2 semanas'
  },

  {
    id: 'siemens-s7-1200-advanced',
    name: 'PLC SIMATIC S7-1200 Advanced',
    description: 'Controlador lógico programable avanzado con capacidades de comunicación extendidas',
    category: 'controllers',
    subcategory: 'plc',
    brand: 'siemens',
    series: 'S7-1200',
    price: 1899.99,
    originalPrice: 2199.99,
    stock: 15,
    image: 'siemens-s7-1200-advanced',
    rating: 4.9,
    
    specifications: {
      cpu: 'CPU 1215C DC/DC/DC',
      memory: '150 KB de memoria de trabajo',
      digitalInputs: '14 entradas digitales',
      digitalOutputs: '10 salidas digitales',
      analogInputs: '2 entradas analógicas',
      analogOutputs: '2 salidas analógicas',
      communication: 'Ethernet + Profinet',
      powerSupply: '24V DC',
      operatingTemperature: '-20°C a +60°C',
      protection: 'IP20'
    },
    
    accessories: [
      {
        id: 'siemens-s7-1200-advanced-expansion-1',
        name: 'Módulo de Expansión High-Speed',
        description: 'Módulo de expansión para aplicaciones de alta velocidad',
        price: 499.99,
        image: 'siemens-expansion-high-speed'
      }
    ],
    

    
    features: [
      'Profinet integrado',
      'Soporte para HMI avanzado',
      'Diagnóstico web',
      'Backup automático',
      'Redundancia opcional'
    ],
    
    applications: [
      'Automatización compleja',
      'Sistemas de control distribuido',
      'Integración con SCADA',
      'Aplicaciones de seguridad'
    ],
    
    certifications: ['CE', 'UL', 'CSA', 'SIL2'],
    warranty: '3 años',
    leadTime: '1-2 semanas'
  },

  // ===== HMI (INTERFACES HUMANO-MÁQUINA) =====
  {
    id: 'siemens-kp900-basic',
    name: 'HMI KTP900 Basic',
    description: 'Panel de operador táctil básico de 9 pulgadas para aplicaciones simples',
    category: 'hmi',
    subcategory: 'touch-panel',
    brand: 'siemens',
    series: 'KTP900',
    price: 899.99,
    originalPrice: 1099.99,
    stock: 30,
    image: 'siemens-ktp900-basic',
    rating: 4.7,
    
    specifications: {
      display: '9" TFT LCD',
      resolution: '800x480 píxeles',
      touch: 'Táctil resistivo',
      memory: '64 MB',
      communication: 'Ethernet + Profinet',
      powerSupply: '24V DC',
      operatingTemperature: '0°C a +50°C',
      protection: 'IP65 frontal'
    },
    
    accessories: [
      {
        id: 'siemens-ktp900-mounting',
        name: 'Kit de Montaje',
        description: 'Kit completo para montaje en panel',
        price: 89.99,
        image: 'siemens-mounting-kit'
      },
      {
        id: 'siemens-ktp900-cable',
        name: 'Cable de Conexión',
        description: 'Cable de conexión Ethernet 2m',
        price: 45.99,
        image: 'siemens-ethernet-cable'
      }
    ],
    

    
    features: [
      'Interfaz intuitiva',
      'Plantillas predefinidas',
      'Alarmas configurables',
      'Trending en tiempo real',
      'Backup automático'
    ],
    
    applications: [
      'Control de máquinas',
      'Monitoreo de procesos',
      'Sistemas de alimentación',
      'Equipos de laboratorio'
    ],
    
    certifications: ['CE', 'UL', 'CSA'],
    warranty: '2 años',
    leadTime: '1 semana'
  },

  // ===== VARIADORES DE FRECUENCIA =====
  {
    id: 'siemens-v20-basic',
    name: 'Variador SINAMICS V20',
    description: 'Variador de frecuencia básico para aplicaciones simples de control de motores',
    category: 'drives',
    subcategory: 'frequency-inverter',
    brand: 'siemens',
    series: 'SINAMICS V20',
    price: 599.99,
    originalPrice: 699.99,
    stock: 50,
    image: 'siemens-sinamics-v20',
    rating: 4.6,
    
    specifications: {
      power: '0.37 - 3 kW',
      inputVoltage: '200-240V AC',
      outputVoltage: '0-240V AC',
      frequency: '0-650 Hz',
      communication: 'RS485',
      protection: 'IP20',
      operatingTemperature: '-10°C a +50°C'
    },
    
    accessories: [
      {
        id: 'siemens-v20-operator-panel',
        name: 'Panel de Operador',
        description: 'Panel de control remoto para V20',
        price: 129.99,
        image: 'siemens-operator-panel'
      },
      {
        id: 'siemens-v20-filter',
        name: 'Filtro EMC',
        description: 'Filtro electromagnético para V20',
        price: 89.99,
        image: 'siemens-emc-filter'
      }
    ],
    

    
    features: [
      'Control vectorial',
      '15 parámetros predefinidos',
      'Protección térmica',
      'Frenado dinámico',
      'Diagnóstico LED'
    ],
    
    applications: [
      'Bombas y ventiladores',
      'Transportadores',
      'Máquinas herramienta',
      'Sistemas de elevación'
    ],
    
    certifications: ['CE', 'UL', 'CSA'],
    warranty: '2 años',
    leadTime: '1 semana'
  },

  // ===== SENSORES =====
  {
    id: 'siemens-ultrasonic-sensor',
    name: 'Sensor Ultrasónico SIMATIC',
    description: 'Sensor de proximidad ultrasónico para detección de objetos',
    category: 'sensors',
    subcategory: 'proximity',
    brand: 'siemens',
    series: 'SIMATIC',
    price: 299.99,
    originalPrice: 349.99,
    stock: 75,
    image: 'siemens-ultrasonic-sensor',
    rating: 4.5,
    
    specifications: {
      range: '20-2000 mm',
      accuracy: '±1% del rango',
      responseTime: '< 50 ms',
      output: 'PNP/NPN configurable',
      powerSupply: '10-30V DC',
      protection: 'IP67',
      operatingTemperature: '-25°C a +70°C'
    },
    
    accessories: [
      {
        id: 'siemens-sensor-cable',
        name: 'Cable de Conexión M12',
        description: 'Cable de conexión M12 5m',
        price: 35.99,
        image: 'siemens-m12-cable'
      },
      {
        id: 'siemens-sensor-mounting',
        name: 'Soporte de Montaje',
        description: 'Soporte ajustable para sensor',
        price: 25.99,
        image: 'siemens-sensor-mount'
      }
    ],
    
    relatedProducts: [
      'siemens-photoelectric-sensor',
      'siemens-inductive-sensor',
      'siemens-capacitive-sensor'
    ],
    
    features: [
      'Detección confiable',
      'Configuración simple',
      'Indicador LED',
      'Protección contra interferencias',
      'Montaje flexible'
    ],
    
    applications: [
      'Control de nivel',
      'Detección de objetos',
      'Sistemas de transporte',
      'Robótica industrial'
    ],
    
    certifications: ['CE', 'UL', 'CSA'],
    warranty: '3 años',
    leadTime: '1 semana'
  },

  // ===== ACTUADORES =====
  {
    id: 'siemens-linear-actuator',
    name: 'Actuador Lineal SIMATIC',
    description: 'Actuador lineal eléctrico para aplicaciones de posicionamiento preciso',
    category: 'actuators',
    subcategory: 'linear',
    brand: 'siemens',
    series: 'SIMATIC',
    price: 899.99,
    originalPrice: 1099.99,
    stock: 20,
    image: 'siemens-linear-actuator',
    rating: 4.8,
    
    specifications: {
      stroke: '100-500 mm',
      force: '500-2000 N',
      speed: '10-50 mm/s',
      accuracy: '±0.1 mm',
      powerSupply: '24V DC',
      communication: 'Profibus/Profinet',
      protection: 'IP65',
      operatingTemperature: '-20°C a +60°C'
    },
    
    accessories: [
      {
        id: 'siemens-actuator-controller',
        name: 'Controlador de Actuador',
        description: 'Controlador dedicado para actuador lineal',
        price: 299.99,
        image: 'siemens-actuator-controller'
      },
      {
        id: 'siemens-actuator-sensor',
        name: 'Sensor de Posición',
        description: 'Sensor de posición absoluta',
        price: 199.99,
        image: 'siemens-position-sensor'
      }
    ],
    

    
    features: [
      'Posicionamiento preciso',
      'Control de velocidad',
      'Frenado suave',
      'Diagnóstico integrado',
      'Mantenimiento predictivo'
    ],
    
    applications: [
      'Máquinas CNC',
      'Sistemas de pick & place',
      'Equipos de prueba',
      'Automatización de laboratorio'
    ],
    
    certifications: ['CE', 'UL', 'CSA'],
    warranty: '2 años',
    leadTime: '2-3 semanas'
  }
];

// Categorías de productos Siemens
export const siemensCategories = [
  {
    id: 'controllers',
    name: 'Controladores',
    subcategories: [
      { id: 'plc', name: 'PLC' },
      { id: 'pac', name: 'PAC' },
      { id: 'rtu', name: 'RTU' }
    ]
  },
  {
    id: 'hmi',
    name: 'Interfaces HMI',
    subcategories: [
      { id: 'touch-panel', name: 'Paneles Táctiles' },
      { id: 'operator-panel', name: 'Paneles de Operador' },
      { id: 'mobile-hmi', name: 'HMI Móvil' }
    ]
  },
  {
    id: 'drives',
    name: 'Variadores',
    subcategories: [
      { id: 'frequency-inverter', name: 'Variadores de Frecuencia' },
      { id: 'servo-drive', name: 'Servo Variadores' },
      { id: 'dc-drive', name: 'Variadores DC' }
    ]
  },
  {
    id: 'sensors',
    name: 'Sensores',
    subcategories: [
      { id: 'proximity', name: 'Sensores de Proximidad' },
      { id: 'temperature', name: 'Sensores de Temperatura' },
      { id: 'pressure', name: 'Sensores de Presión' },
      { id: 'flow', name: 'Sensores de Flujo' }
    ]
  },
  {
    id: 'actuators',
    name: 'Actuadores',
    subcategories: [
      { id: 'linear', name: 'Actuadores Lineales' },
      { id: 'rotary', name: 'Actuadores Rotativos' },
      { id: 'pneumatic', name: 'Actuadores Neumáticos' }
    ]
  }
];

// Series de productos Siemens
export const siemensSeries = [
  { id: 's7-1200', name: 'SIMATIC S7-1200', category: 'controllers' },
  { id: 's7-1500', name: 'SIMATIC S7-1500', category: 'controllers' },
  { id: 's7-300', name: 'SIMATIC S7-300', category: 'controllers' },
  { id: 's7-400', name: 'SIMATIC S7-400', category: 'controllers' },
  { id: 'ktp900', name: 'KTP900 Basic', category: 'hmi' },
  { id: 'ktp1200', name: 'KTP1200 Basic', category: 'hmi' },
  { id: 'ktp1500', name: 'KTP1500 Basic', category: 'hmi' },
  { id: 'sinamics-v20', name: 'SINAMICS V20', category: 'drives' },
  { id: 'sinamics-g120', name: 'SINAMICS G120', category: 'drives' },
  { id: 'sinamics-v90', name: 'SINAMICS V90', category: 'drives' }
]; 