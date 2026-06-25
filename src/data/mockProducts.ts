import board1_real from "../assets/wilyfox126.avif";
import board2_real from "../assets/wilyfox-127.avif";
import board3_real from "../assets/wilyfox-124.avif";
import board4_real from "../assets/wilyfox-125.webp";
import board1 from "../assets/imageforproject-1.webp"; // Arduino + HC-SR04 image
import board2 from "../assets/wilyfoxbhabani1.avif";
import board3 from "../assets/wilyfoxbhabani2.avif";
import board4 from "../assets/wilyfoxbhabani3.avif";
import extra1 from "../assets/wilyfox-123.png";
import extra2 from "../assets/wilyfoximage1.png";
import extra3 from "../assets/wilyfoximage2.png";
import extra4 from "../assets/wilfox-image3.png";
import extra5 from "../assets/wilfoximage45.png";

// Drone images from assets
import drone1 from "../assets/drones image.webp";
import drone2 from "../assets/drones iamge-2.webp";
import drone3 from "../assets/drones image 3.webp";
import drone4 from "../assets/drones image 4.webp";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

export interface SpecificationCategory {
  [key: string]: string;
}

export interface Specifications {
  [category: string]: SpecificationCategory;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  deliveryInfo: string;
  highlights: string[];
  description: string;
  keyFeatures: string[];
  specifications: Specifications;
  dimensions: string;
  material: string;
  warranty: string;
  images: string[];
  reviews: Review[];
  sku?: string;
  availability?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export const mockCategories: Category[] = [
  {
    id: "drones",
    name: "Drones",
    description: "Explore advanced drones for aerial photography, surveillance, mapping, agriculture, inspections, and robotics research.",
    image: drone1,
    count: 4,
  },
  {
    id: "3d-printing-parts",
    name: "3D Printing Parts",
    description: "Premium nozzles, hotends, extruders, stepper motors, controllers, filaments, and accessories.",
    image: board4_real,
    count: 5,
  },
  {
    id: "wireless-modules",
    name: "Wireless Modules",
    description: "Communication modules for IoT, smart automation, wireless control systems, and embedded applications.",
    image: board3,
    count: 5,
  },
  {
    id: "sensor-modules",
    name: "Sensor Modules",
    description: "Ultrasonic, IR, Gas, Temperature, Humidity, Motion, Vision, and Industrial Sensors.",
    image: board1,
    count: 5,
  },
  {
    id: "robotics-kits",
    name: "Robotics Kits",
    description: "STEM learning kits, robotic arms, line follower robots, obstacle avoidance robots, and advanced robotics platforms.",
    image: board4,
    count: 3,
  },
  {
    id: "development-boards",
    name: "Development Boards",
    description: "Arduino, Raspberry Pi, ESP32, STM32, BeagleBone, and embedded development boards.",
    image: board1, // "Use uploaded Arduino + HC-SR04 Ultrasonic Sensor image"
    count: 5,
  },
];

export const mockProducts: Product[] = [
  // ================= DRONES =================
  {
    id: "drone-1",
    name: "DJI Mini 4 Pro Camera Drone",
    brand: "DJI",
    category: "drones",
    rating: 4.9,
    reviewCount: 184,
    price: 89999,
    originalPrice: 99999,
    discount: 10,
    inStock: true,
    deliveryInfo: "FREE Delivery: Tomorrow, Jun 18 by 12 PM.",
    sku: "DJI-M4P-001",
    availability: "In Stock",
    highlights: [
      "Under 249g Ultra-Lightweight & Foldable Design",
      "4K/60fps HDR True Vertical Shooting",
      "Omnidirectional Obstacle Sensing for maximum safety",
      "Up to 34 minutes of flight time (extendable to 45 mins)",
      "20km FHD Video Transmission (O4)",
      "Flagship tracking features (ActiveTrack 360°)"
    ],
    description: "The DJI Mini 4 Pro is our most advanced mini-camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, ActiveTrack 360° with the new Trace Mode, and 20km FHD video transmission, bringing more things to love for pros and beginners alike. Perfect for capturing high-definition aerial footage on the go.",
    keyFeatures: [
      "1/1.3-inch CMOS Sensor with Dual Native ISO Fusion",
      "f/1.7 aperture and large 2.4μm 4-in-1 pixels for low-light night shots",
      "Night Shots video mode with optimized noise reduction",
      "True Vertical Shooting enables layouts optimized for mobile displays"
    ],
    specifications: {
      "General": {
        "Model": "Mini 4 Pro",
        "Type": "Camera Drone",
        "Weight": "249 g",
        "Color": "Gray"
      },
      "Camera": {
        "Sensor": "1/1.3-inch CMOS",
        "Photo Resolution": "48 MP",
        "Video Resolution": "4K at 60fps HDR",
        "Digital Zoom": "1x to 4x"
      },
      "Flight & Battery": {
        "Max Flight Time": "34 mins (Intelligent Flight Battery)",
        "Max Speed": "16 m/s",
        "Battery Capacity": "2590 mAh",
        "Charging Time": "70 mins"
      }
    },
    dimensions: "Folded: 148×94×64 mm, Unfolded: 298×373×101 mm",
    material: "High-grade carbon-fiber reinforced polymer",
    warranty: "1 Year Manufacturer Warranty",
    images: [drone1, drone2, drone3, drone4],
    reviews: [
      {
        id: "dr-r1",
        userName: "Arvind Swamy",
        rating: 5,
        date: "2026-06-10",
        comment: "Outstanding camera quality. The vertical shooting mode is a game changer for social media creators.",
        images: []
      },
      {
        id: "dr-r2",
        userName: "Sam Miller",
        rating: 5,
        date: "2026-05-24",
        comment: "Extremely stable in windy conditions despite being so light. Obstacle sensors saved it twice already!",
        images: []
      }
    ]
  },
  {
    id: "drone-2",
    name: "SAKRO FPV Racing Drone Kit",
    brand: "SAKROBOTIX",
    category: "drones",
    rating: 4.7,
    reviewCount: 96,
    price: 24999,
    originalPrice: 35000,
    discount: 28,
    inStock: true,
    deliveryInfo: "FREE Delivery: Friday, Jun 19.",
    sku: "SAK-FPV-R02",
    availability: "In Stock",
    highlights: [
      "Full Carbon Fiber 220mm Racing Frame",
      "F4 Flight Controller with OSD and 45A ESC",
      "2207 2400KV Brushless Motors for high speed",
      "1200TVL Low Latency FPV Camera",
      "Supports 3S-4S LiPo Batteries for intense throttle response",
      "Includes FlySky FS-i6X Remote Controller"
    ],
    description: "Experience the thrill of high-speed drone racing with the SAKRO FPV Racing Drone. Engineered for agility, speed, and durability, this kit comes fully assembled and tuned. The 220mm carbon fiber frame absorbs heavy impacts, and the onboard flight controller offers multiple flight modes, from self-stabilizing beginner mode to full manual acro mode.",
    keyFeatures: [
      "Acro and Angle flying modes selectable via remote switch",
      "Vibrant programmable LED tail strip for visual tracking",
      "Real-time battery voltage telemetry on FPV goggles or controller screen"
    ],
    specifications: {
      "General": {
        "Model": "SAKRO-FPV-220",
        "Frame Size": "220 mm",
        "Weight": "450 g (without battery)",
        "Material": "3K Carbon Fiber"
      },
      "Propulsion": {
        "Motors": "2207 2400KV Brushless",
        "Propellers": "5045 3-Blade Propellers",
        "ESC": "45A 4-in-1 BLHeli_S"
      },
      "Electronics": {
        "Flight Controller": "Omnibus F4 V3",
        "Transmitter": "5.8G 40CH 25-600mW VTX",
        "FPV Camera": "1200TVL CMOS"
      }
    },
    dimensions: "220 mm diagonal wheel base",
    material: "3K Matte Carbon Fiber Plate",
    warranty: "6 Months Technical Warranty",
    images: [drone2, drone3, drone4, drone1],
    reviews: [
      {
        id: "dr-r3",
        userName: "Kunal Ghosh",
        rating: 5,
        date: "2026-05-15",
        comment: "Incredible speed! Clocked 110 km/h on my first flight. Very sturdy frame, survived a hard crash into a tree.",
        images: []
      }
    ]
  },
  {
    id: "drone-3",
    name: "SAKRO Agricultural Spray Drone",
    brand: "SAKROBOTIX",
    category: "drones",
    rating: 4.8,
    reviewCount: 42,
    price: 185000,
    originalPrice: 220000,
    discount: 15,
    inStock: true,
    deliveryInfo: "Delivery by Cargo within 5-7 working days.",
    sku: "SAK-AGRI-10L",
    availability: "Limited Stock",
    highlights: [
      "10-Liter Payload Capacity for pesticides/fertilizers",
      "High-pressure dual nozzles covering 3-5 meters width",
      "GPS Position Hold & Autonomous Path Planning",
      "Heavy-duty folding arm mechanism for easy transportation",
      "Terrain Follow radar for precision altitude tracking",
      "Fail-safe Return to Home (RTH) on low battery"
    ],
    description: "The SAKRO Agricultural Drone is a state-of-the-art solution designed to optimize liquid pesticide and fertilizer spraying. Equipped with autonomous flight path planning and obstacle radar, this drone can spray up to 2-3 acres per flight. Its folding frame is highly portable, and it is dust/water resistant (IP67), making it reliable in rugged farming environments.",
    keyFeatures: [
      "High-precision flow sensor adjusts spray rate dynamically based on speed",
      "Real-time radar sensors avoid obstacles like trees and electricity lines",
      "Intelligent power management automatically alerts operator when tank is empty"
    ],
    specifications: {
      "General": {
        "Model": "Agri-Spray-X10",
        "Tank Volume": "10 Liters",
        "Max Takeoff Weight": "24.9 kg",
        "IP Rating": "IP67 Water-dust resistant"
      },
      "Performance": {
        "Max Flight Time": "18 mins (loaded) / 28 mins (empty)",
        "Spraying Width": "3 to 4.5 meters",
        "Efficiency": "1.5 acres in 10 minutes",
        "Radar Detection": "Up to 15 meters"
      }
    },
    dimensions: "Folded: 600×550×600 mm, Unfolded: 1200×1200×600 mm",
    material: "Aviation-grade aluminum alloys & Carbon Fiber",
    warranty: "1 Year On-site Technical Support & Warranty",
    images: [drone3, drone4, drone1, drone2],
    reviews: [
      {
        id: "dr-r4",
        userName: "Manpreet Singh",
        rating: 5,
        date: "2026-04-12",
        comment: "Excellent performance in our rice fields. Saved us days of manual labor. Highly recommend the training module offered by SAKROBOTIX.",
        images: []
      }
    ]
  },
  {
    id: "drone-4",
    name: "SAKRO Professional mapping & Camera Drone",
    brand: "SAKROBOTIX",
    category: "drones",
    rating: 4.6,
    reviewCount: 35,
    price: 110000,
    originalPrice: 135000,
    discount: 18,
    inStock: true,
    deliveryInfo: "FREE Delivery: Friday, Jun 19.",
    sku: "SAK-MAP-CAM4K",
    availability: "In Stock",
    highlights: [
      "4K UHD Sony Exmor Sensor Camera",
      "3-Axis Brushless Gimbal for cinematic stabilization",
      "Waypoints & Mapping autonomous flight planning",
      "Up to 40 minutes flight time with high capacity battery",
      "RTK module compatibility for centimeter-level mapping accuracy",
      "Lightweight impact-resistant polycarbonate frame"
    ],
    description: "Engineered specifically for surveying, GIS mapping, and high-altitude cinematography, the SAKRO Professional Camera Drone delivers exceptional spatial accuracy and picture quality. Dual frequency GPS/GLONASS receivers ensure a solid satellite lock, while the companion PC/Mobile App allows complex grid path generation for automatic orthomosaic photography.",
    keyFeatures: [
      "Real-Time Kinematic (RTK) upgradeable for precise geo-tagging",
      "Interchangeable camera mounts to support thermal or multispectral sensors",
      "Long range digital telemetry link up to 8 km"
    ],
    specifications: {
      "General": {
        "Model": "MapCam-Pro",
        "Application": "Mapping, Surveying, Photography",
        "Weight": "1.2 kg"
      },
      "Camera": {
        "Sensor": "20MP Sony CMOS 1-inch",
        "Video": "4K UHD at 60fps",
        "Field of View": "84 degrees"
      },
      "Connectivity": {
        "Telemetry Range": "8 km",
        "GPS Mode": "GPS + GLONASS + Galileo"
      }
    },
    dimensions: "350 mm diagonal wheelbase (excluding props)",
    material: "Polycarbonate, high-modulus carbon tubes",
    warranty: "1 Year Warranty on electronics",
    images: [drone4, drone1, drone2, drone3],
    reviews: [
      {
        id: "dr-r5",
        userName: "Dr. Rajesh Nayak",
        rating: 4,
        date: "2026-05-01",
        comment: "Very accurate coordinates for land surveying. Camera clarity is top notch. Wish the battery charging was a bit faster.",
        images: []
      }
    ]
  },

  // ================= 3D PRINTING PARTS =================
  {
    id: "3d-1",
    name: "Premium Brass Extruder Nozzle 0.4mm (Pack of 5)",
    brand: "Creality",
    category: "3d-printing-parts",
    rating: 4.5,
    reviewCount: 156,
    price: 249,
    originalPrice: 499,
    discount: 50,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "CRE-NZL-04M",
    availability: "In Stock",
    highlights: [
      "Precision CNC machined premium brass material",
      "0.4mm output nozzle diameter, M6 screw thread",
      "Smooth internal wall minimizes filament clogs",
      "Perfectly flat face prevents print leakages",
      "Compatible with Ender-3, Ender-5, CR-10 series"
    ],
    description: "Premium replacement nozzles for your FDM 3D printers. Made of high-thermal conductivity brass, they ensure uniform heating and consistent extrusion. The pack contains five 0.4mm nozzles, the industry standard for balanced printing speed and high detail.",
    keyFeatures: [
      "Heavy duty brass construction with high wear resistance",
      "Engraved dimensions on the side for easy identification"
    ],
    specifications: {
      "General": {
        "Material": "Premium Brass",
        "Thread Type": "M6 Thread",
        "Input Diameter": "1.75 mm Filament",
        "Output Diameter": "0.4 mm"
      }
    },
    dimensions: "13 mm x 6 mm",
    material: "Premium Brass",
    warranty: "No Warranty",
    images: [board4_real, board1_real, board2_real],
    reviews: [
      { id: "3d-r1", userName: "Debashis P.", rating: 5, date: "2026-06-03", comment: "Excellent finish. Resolved my clogging issues completely." }
    ]
  },
  {
    id: "3d-2",
    name: "All-Metal Dual Drive Extruder Upgrade",
    brand: "Bondtech Clone",
    category: "3d-printing-parts",
    rating: 4.6,
    reviewCount: 88,
    price: 899,
    originalPrice: 1800,
    discount: 50,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "EXT-DUAL-DRV",
    availability: "In Stock",
    highlights: [
      "Dual-drive gear design grips filament from both sides",
      "Prevents slipping or chewing of flexible filaments (TPU)",
      "High-precision injection molded components",
      "Adjustable spring tension thumb-screw",
      "Compatible with direct drive or bowden setups"
    ],
    description: "Upgrade your single-gear extruder with this premium Dual-Drive Extruder. By clamping the filament from both sides, it delivers twice the pushing force with zero slippage, ensuring precise retraction and smooth prints even with tricky filaments like TPU, PETG, and ABS.",
    keyFeatures: [
      "Double drive gear provides positive, non-slip grip",
      "Tension adjustment screw enables tuning for soft and hard plastics"
    ],
    specifications: {
      "General": {
        "Type": "Dual Drive Extruder",
        "Filament Support": "1.75 mm",
        "Ratio": "3:1 gearing mechanism",
        "Mounting": "NEMA 17 Stepper mountable"
      }
    },
    dimensions: "42 mm x 32 mm x 50 mm",
    material: "Aluminum Alloy & Molded Plastic",
    warranty: "3 Months Warranty",
    images: [board1_real, board2_real, board3_real],
    reviews: [
      { id: "3d-r2", userName: "Mohit J.", rating: 5, date: "2026-05-18", comment: "Awesome extruder! Retraction prints are super clean now." }
    ]
  },
  {
    id: "3d-3",
    name: "V6 All-Metal Hotend Kit (24V 40W)",
    brand: "E3D Clone",
    category: "3d-printing-parts",
    rating: 4.4,
    reviewCount: 74,
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    inStock: true,
    deliveryInfo: "FREE Delivery: Friday, Jun 19.",
    sku: "HOT-V6-24V",
    availability: "In Stock",
    highlights: [
      "All-metal heat break prints up to 300°C",
      "Includes 24V 40W heater cartridge & NTC 100K thermistor",
      "Specially designed cooling shroud with 3010 fan",
      "Reduces stringing and increases thermal efficiency",
      "Supports PLA, ABS, PETG, Nylon, and TPU"
    ],
    description: "The V6 Hotend is designed for high-temperature printing. Featuring an all-metal heat break, it separates the hot melting zone from the cold sink efficiently. Allows you to print engineering filaments like Nylon and Polycarbonate without toxic PTFE fumes melting.",
    keyFeatures: [
      "Aluminum heatsink for active thermal dissipation",
      "Pre-wired thermistor and heater cartridge for easy installation"
    ],
    specifications: {
      "General": {
        "Max Temperature": "300 °C",
        "Heater Voltage": "24V",
        "Heater Wattage": "40W",
        "Thermistor Type": "NTC 100K 3950"
      }
    },
    dimensions: "Heatsink length: 62.3mm",
    material: "Aluminum, Stainless Steel, Brass",
    warranty: "6 Months Technical Warranty",
    images: [board2_real, board3_real, board4_real],
    reviews: [
      { id: "3d-r3", userName: "Subhash R.", rating: 4, date: "2026-04-29", comment: "Takes a bit of tuning in slicer settings, but prints beautifully at high temperatures." }
    ]
  },
  {
    id: "3d-4",
    name: "Premium PLA Filament 1.75mm (1kg, Jet Black)",
    brand: "SAKROBOTIX",
    category: "3d-printing-parts",
    rating: 4.8,
    reviewCount: 220,
    price: 999,
    originalPrice: 1599,
    discount: 37,
    inStock: true,
    deliveryInfo: "FREE Delivery: Tomorrow, Jun 17 by 5 PM.",
    sku: "PLA-175-BLK",
    availability: "In Stock",
    highlights: [
      "Strict dimensional tolerance of ±0.02mm",
      "No warping, bubble-free, and vacuum-sealed packaging",
      "Made of biodegradable organic cornstarch raw material",
      "Recommended print temp: 190°C - 220°C",
      "Eco-friendly cardboard spool"
    ],
    description: "High-performance PLA filament designed for everyday 3D printing. Made of premium quality resin, it offers excellent layer adhesion and minimal shrinkage. Perfect for prototyping, educational models, and structural enclosures.",
    keyFeatures: [
      "Zero bubbles or moisture issues due to desiccated vacuum sealing",
      "Consistent diameter ensures clean extrusion lines"
    ],
    specifications: {
      "General": {
        "Filament Material": "Polylactic Acid (PLA)",
        "Diameter": "1.75 mm ± 0.02 mm",
        "Net Weight": "1.0 kg (2.2 lbs)",
        "Spool Core": "Cardboard Spool"
      }
    },
    dimensions: "Spool outer diameter: 200mm, width: 64mm",
    material: "Polylactic Acid",
    warranty: "Replacement if seal is broken on delivery",
    images: [board3_real, board4_real, board1_real],
    reviews: [
      { id: "3d-r4", userName: "Asha Nair", rating: 5, date: "2026-06-12", comment: "Super smooth layers, matte black look. Will buy again." }
    ]
  },
  {
    id: "3d-5",
    name: "MKS Gen L V2.1 3D Printer Controller Board",
    brand: "Makerbase",
    category: "3d-printing-parts",
    rating: 4.7,
    reviewCount: 45,
    price: 1799,
    originalPrice: 2999,
    discount: 40,
    inStock: true,
    deliveryInfo: "FREE Delivery: Friday, Jun 19.",
    sku: "MKS-GENL-V21",
    availability: "In Stock",
    highlights: [
      "Atmel Mega2560 main control chip, fully Arduino compatible",
      "Supports various stepper drivers: A4988, DRV8825, TMC2208/2209",
      "High quality MOSFETs for optimized heat dissipation",
      "Supports 12V-24V power input for faster bed heating",
      "Runs Marlin firmware out-of-the-box"
    ],
    description: "The MKS Gen L is an all-in-one mainboard that integrates the power and logic of an Arduino Mega 2560 and RAMPS 1.4 interface onto a single robust PCB. It features swappable stepper driver sockets, giving you full control to upgrade to silent stepper drivers.",
    keyFeatures: [
      "Onboard high quality 4-layer PCB for better thermals",
      "Dedicated ports for BLTouch, displays (12864 LCD, TFT), and dual Z motors"
    ],
    specifications: {
      "General": {
        "Controller MCU": "Atmel ATmega2560",
        "Input Voltage": "12V - 24V DC",
        "Supported Drivers": "5 swappable sockets",
        "Firmware Compatibility": "Marlin, Repetier"
      }
    },
    dimensions: "110 mm x 84 mm",
    material: "Premium FR4 PCB",
    warranty: "6 Months Manufacturer Warranty",
    images: [board4_real, board2_real, board1_real],
    reviews: [
      { id: "3d-r5", userName: "Joy Dev", rating: 5, date: "2026-05-20", comment: "Perfect replacement for my broken Ender motherboard. Upgraded to TMC2209, dead silent." }
    ]
  },

  // ================= WIRELESS MODULES =================
  {
    id: "wl-1",
    name: "ESP32 DevKitC V4 Development Board (NodeMCU-32S)",
    brand: "Espressif",
    category: "wireless-modules",
    rating: 4.8,
    reviewCount: 412,
    price: 349,
    originalPrice: 799,
    discount: 56,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "ESP-DEV-V4",
    availability: "In Stock",
    highlights: [
      "Dual-core Tensilica LX6 32-bit microprocessor @ 240MHz",
      "Integrated 802.11 b/g/n Wi-Fi & Bluetooth v4.2 BR/EDR and BLE",
      "4MB SPI Flash Memory, 520KB SRAM",
      "Micro-USB CP2102 serial-to-USB converter interface",
      "Rich peripheral set: capacitive touch, ADCs, DACs, I2C, SPI, UART"
    ],
    description: "The ESP32 DevKitC V4 is a small-sized ESP32-based development board. Most of the I/O pins are broken out to the pin headers on both sides for easy interfacing. Developers can connect peripherals with jumper wires or mount the board on a breadboard.",
    keyFeatures: [
      "Support for multiple programming environments including Arduino IDE, ESP-IDF, and MicroPython",
      "Ultra-low power sleep states for battery-operated IoT sensors"
    ],
    specifications: {
      "General": {
        "Processor": "Tensilica Dual-Core LX6",
        "Wi-Fi Frequency": "2.4 GHz",
        "Bluetooth": "Version 4.2 BLE",
        "Flash Size": "4 MB"
      }
    },
    dimensions: "48.2 mm x 27.9 mm",
    material: "FR4 PCB",
    warranty: "1 Month Replacement Warranty",
    images: [board3, extra2, extra3],
    reviews: [
      { id: "wl-r1", userName: "Pavan K.", rating: 5, date: "2026-06-11", comment: "Clean soldering, boots instantly, handles Wi-Fi servers easily." }
    ]
  },
  {
    id: "wl-2",
    name: "NodeMCU ESP8266 ESP-12E WiFi Board",
    brand: "AI-Thinker",
    category: "wireless-modules",
    rating: 4.7,
    reviewCount: 310,
    price: 199,
    originalPrice: 499,
    discount: 60,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "ESP-12E-NMCU",
    availability: "In Stock",
    highlights: [
      "Low cost, integrated Wi-Fi module @ 80MHz clock speed",
      "CP2102 USB to UART driver chip",
      "10 GPIO pins, PWM, I2C, SPI and 1 Analog Input (ADC)",
      "Standard Micro-USB connection",
      "Ideal for smart home automation, web servers, and logging projects"
    ],
    description: "The NodeMCU is an open-source firmware and development kit that helps you to prototype your IoT product within a few Lua script lines or standard Arduino code. Powered by the ESP8266 chip, it connects directly to local Wi-Fi networks.",
    keyFeatures: [
      "Integrated PCB antenna for stable wireless range",
      "Onboard reset and flash buttons"
    ],
    specifications: {
      "General": {
        "Chipset": "ESP8266EX",
        "Wi-Fi Protocol": "802.11 b/g/n",
        "Operating Voltage": "3.3V (5V via USB)",
        "GPIO Pins": "10"
      }
    },
    dimensions: "49 mm x 25 mm",
    material: "FR4 PCB",
    warranty: "1 Month Replacement Warranty",
    images: [extra3, board3, extra2],
    reviews: [
      { id: "wl-r2", userName: "Vinay C.", rating: 4, date: "2026-05-15", comment: "Affordable and highly functional. Great for simple temperature logging over Wi-Fi." }
    ]
  },
  {
    id: "wl-3",
    name: "LoRa SX1278 Wireless Transceiver Module 433MHz",
    brand: "Semtech",
    category: "wireless-modules",
    rating: 4.6,
    reviewCount: 88,
    price: 499,
    originalPrice: 899,
    discount: 44,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "LORA-SX1278-433",
    availability: "In Stock",
    highlights: [
      "Long-range spread spectrum communication up to 5-10 km",
      "433MHz frequency band (licence-free in India)",
      "SPI data interface connection",
      "High sensitivity of -148dBm, high interference immunity",
      "Comes with external spring antenna"
    ],
    description: "The SX1278 LoRa transceiver module features long-range spread spectrum communication and high interference immunity. It offers high sensitivity and is ideal for projects requiring telemetry and data transmission over several kilometers without cellular coverage.",
    keyFeatures: [
      "Excellent link budget for long-distance transmissions through walls and obstacles",
      "Programmable bit-rates up to 300 kbps"
    ],
    specifications: {
      "General": {
        "Frequency Band": "433 MHz",
        "Modulation": "LoRa, FSK, GFSK, OOK",
        "Interface": "SPI",
        "Output Power": "+20dBm - 100mW"
      }
    },
    dimensions: "17 mm x 16 mm",
    material: "FR4 PCB",
    warranty: "6 Months Technical Warranty",
    images: [board3, board1_real, board2_real],
    reviews: [
      { id: "wl-r3", userName: "Amit Ray", rating: 5, date: "2026-04-10", comment: "Set up a remote farm monitoring sensor. Easily got 3km range through dense trees." }
    ]
  },
  {
    id: "wl-4",
    name: "NRF24L01+ 2.4GHz Wireless Transceiver Module",
    brand: "Nordic Semi",
    category: "wireless-modules",
    rating: 4.5,
    reviewCount: 198,
    price: 99,
    originalPrice: 249,
    discount: 60,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "NRF-24L01-24G",
    availability: "In Stock",
    highlights: [
      "2.4GHz ISM band wireless transceiver",
      "Low operating voltage: 1.9V - 3.6V (SPI logic is 5V tolerant)",
      "Built-in antennas and auto-acknowledge packet handling",
      "Range: 50-100 meters (line of sight)",
      "Supports data rates of 250kbps, 1Mbps, and 2Mbps"
    ],
    description: "A very popular RF module for remote controls, wireless keyboards, and custom robotics controls. Operating in the 2.4GHz frequency, it uses SPI communication to send packets between dual microcontrollers.",
    keyFeatures: [
      "Ultra low power consumption for smart peripherals",
      "Multi-receiver support (can receive from 6 devices simultaneously)"
    ],
    specifications: {
      "General": {
        "Frequency": "2.4 GHz",
        "Max Data Rate": "2 Mbps",
        "Operating Current": "12.3mA at max power",
        "Pinout": "8-pin header configuration"
      }
    },
    dimensions: "29 mm x 15 mm",
    material: "FR4 PCB",
    warranty: "Testing Warranty",
    images: [board3, extra2, board1],
    reviews: [
      { id: "wl-r4", userName: "Lalit G.", rating: 5, date: "2026-05-11", comment: "Dirt cheap wireless communication. Make sure to add a 10uF capacitor across VCC/GND for stable performance." }
    ]
  },
  {
    id: "wl-5",
    name: "HC-05 Wireless Bluetooth RF Transceiver Module",
    brand: "SAKROBOTIX",
    category: "wireless-modules",
    rating: 4.6,
    reviewCount: 145,
    price: 279,
    originalPrice: 599,
    discount: 53,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "HC-05-BT-MOD",
    availability: "In Stock",
    highlights: [
      "Bluetooth V2.0+EDR (Enhanced Data Rate) 3Mbps Modulation",
      "Operates in Master/Slave configuration",
      "Standard UART serial interface with programmable baud rates",
      "Onboard status LED and State pin",
      "Works with Android mobile apps for robotic control"
    ],
    description: "HC-05 module is an easy-to-use Bluetooth SPP (Serial Port Protocol) module, designed for transparent wireless serial connection setup. It can be configured as a transmitter or receiver, allowing a phone to trigger Arduino pins.",
    keyFeatures: [
      "Configurable via standard AT commands by pulling KEY pin high",
      "Built-in 3.3V regulator allows 5V power input"
    ],
    specifications: {
      "General": {
        "Bluetooth Profile": "Serial Port Protocol (SPP)",
        "Operating Voltage": "3.6V - 6V DC",
        "Default Baud Rate": "9600 bps",
        "Range": "10 meters"
      }
    },
    dimensions: "37.5 mm x 15.6 mm",
    material: "FR4 PCB with breakout shield",
    warranty: "6 Months Warranty",
    images: [board3, extra4, extra1],
    reviews: [
      { id: "wl-r5", userName: "Rakesh S.", rating: 4, date: "2026-06-01", comment: "Perfect for controlling my smart car kit using my Android phone via Bluetooth." }
    ]
  },

  // ================= SENSOR MODULES =================
  {
    id: "sn-1",
    name: "HC-SR04 Ultrasonic Distance Sensor Module",
    brand: "SAKROBOTIX",
    category: "sensor-modules",
    rating: 4.7,
    reviewCount: 420,
    price: 99,
    originalPrice: 249,
    discount: 60,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "HC-SR04-ULT",
    availability: "In Stock",
    highlights: [
      "Non-contact distance measurement from 2cm to 400cm",
      "High accuracy: up to 3mm measurement resolution",
      "Trigger input and Echo output pins",
      "Operating voltage: 5V DC",
      "Widely used in obstacle avoidance robots and level monitoring"
    ],
    description: "The HC-SR04 ultrasonic sensor uses sonar to determine distance to an object. It offers excellent range accuracy and stable readings in an easy-to-use package. Its operation is not affected by sunlight or black material (unlike optical rangefinders).",
    keyFeatures: [
      "Dual transducer modules: transmitter and receiver in one",
      "Includes breadboard-friendly 4-pin male headers"
    ],
    specifications: {
      "General": {
        "Working Voltage": "5V DC",
        "Working Current": "15 mA",
        "Frequency": "40 kHz",
        "Measuring Angle": "15 degrees"
      }
    },
    dimensions: "45 mm x 20 mm x 15 mm",
    material: "FR4 Board",
    warranty: "6 Months Technical Warranty",
    images: [board1, extra4, board4],
    reviews: [
      { id: "sn-r1", userName: "Ajay Dev", rating: 5, date: "2026-06-14", comment: "The standard sensor for obstacle avoiding smart cars. Very precise for the price." }
    ]
  },
  {
    id: "sn-2",
    name: "IR Infrared Obstacle Avoidance Sensor Module",
    brand: "SAKROBOTIX",
    category: "sensor-modules",
    rating: 4.4,
    reviewCount: 135,
    price: 49,
    originalPrice: 129,
    discount: 62,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "IR-OBS-AVD",
    availability: "In Stock",
    highlights: [
      "Detection distance: 2cm to 30cm (adjustable via potentiometer)",
      "Dual emitter and receiver tube for IR reflection",
      "Digital output pin goes LOW when obstacle is detected",
      "Onboard power and status indicator LEDs",
      "Operating voltage: 3.3V to 5V DC"
    ],
    description: "IR obstacle avoidance sensor module has a pair of infrared transmitting and receiving tubes. When the transmitted signal reflects off an obstacle, the receiving tube catches the reflection, pulling the output pin LOW.",
    keyFeatures: [
      "Potentiometer allows fine-tuning of sensitivity and range",
      "Comparator chip LM393 ensures clean digital logic outputs"
    ],
    specifications: {
      "General": {
        "Supply Voltage": "3.3V - 5V DC",
        "Output Type": "Digital (HIGH/LOW)",
        "Detection Angle": "35 degrees",
        "Chipset": "LM393 Comparator"
      }
    },
    dimensions: "32 mm x 14 mm",
    material: "FR4 Board",
    warranty: "Testing Warranty Only",
    images: [board1, board2_real, board3_real],
    reviews: [
      { id: "sn-r2", userName: "Karan B.", rating: 4, date: "2026-05-18", comment: "Works well in indoor lighting. Direct sunlight can interfere with the IR reflection, as expected." }
    ]
  },
  {
    id: "sn-3",
    name: "DHT11 Temperature & Humidity Sensor Module",
    brand: "Aosong",
    category: "sensor-modules",
    rating: 4.6,
    reviewCount: 280,
    price: 129,
    originalPrice: 299,
    discount: 56,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "DHT11-TMP-HUM",
    availability: "In Stock",
    highlights: [
      "Calibrated digital output containing temperature and humidity values",
      "Humidity range: 20-90% RH (±5% accuracy)",
      "Temperature range: 0-50°C (±2°C accuracy)",
      "Single-bus digital interface, easy to wire with microcontrollers",
      "Low power consumption, high long-term stability"
    ],
    description: "The DHT11 is a basic, ultra low-cost digital temperature and humidity sensor. It uses a capacitive humidity sensor and a thermistor to measure the surrounding air, spitting out a digital signal on the data pin without needing analog inputs.",
    keyFeatures: [
      "Includes a 3-pin breakout PCB with pre-installed pull-up resistor",
      "Requires only 1 data pin for readouts"
    ],
    specifications: {
      "General": {
        "Working Voltage": "3V - 5.5V DC",
        "Max Current": "2.5mA (during conversions)",
        "Sampling Rate": "1 Hz (1 reading per second)"
      }
    },
    dimensions: "28 mm x 12 mm x 5 mm",
    material: "Plastic casing & FR4 Board",
    warranty: "6 Months Technical Warranty",
    images: [board1, board3_real, board4_real],
    reviews: [
      { id: "sn-r3", userName: "Rita M.", rating: 5, date: "2026-05-22", comment: "Simple to code using DHT libraries. Output is accurate enough for a home weather station." }
    ]
  },
  {
    id: "sn-4",
    name: "MQ-2 Gas and Smoke Sensor Module",
    brand: "SAKROBOTIX",
    category: "sensor-modules",
    rating: 4.5,
    reviewCount: 94,
    price: 149,
    originalPrice: 349,
    discount: 57,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "MQ2-GAS-SMK",
    availability: "In Stock",
    highlights: [
      "Detects LPG, butane, propane, methane, alcohol, hydrogen, and smoke",
      "Dual outputs: Analog (real-time concentration) & Digital (threshold trigger)",
      "Sensitivity adjustable via onboard potentiometer",
      "Heating element takes 20-30 seconds to stabilize before readouts",
      "Operating voltage: 5V DC"
    ],
    description: "The MQ-2 Gas Sensor module is useful for gas leakage detection in home and industry. Due to its fast response and high sensitivity, measurements can be taken as soon as possible. The threshold for the digital output is adjustable via a potentiometer.",
    keyFeatures: [
      "Tin Dioxide (SnO2) sensing material with high sensitivity to combustible gases",
      "Onboard heater coil provides optimal operating temperature inside"
    ],
    specifications: {
      "General": {
        "Sensing Concentration": "300 to 10000 ppm",
        "Heater Resistance": "31 ohms",
        "Operating Current": "150 mA"
      }
    },
    dimensions: "32 mm x 22 mm x 27 mm",
    material: "Bakelite base & Steel mesh cover",
    warranty: "6 Months Technical Warranty",
    images: [board1, extra4, extra1],
    reviews: [
      { id: "sn-r4", userName: "Divya T.", rating: 5, date: "2026-04-18", comment: "Built a fire alarm system. Highly sensitive to butane lighter gas and smoke." }
    ]
  },
  {
    id: "sn-5",
    name: "HC-SR501 PIR Motion Sensor Module",
    brand: "SAKROBOTIX",
    category: "sensor-modules",
    rating: 4.6,
    reviewCount: 172,
    price: 89,
    originalPrice: 199,
    discount: 55,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "HC-SR501-PIR",
    availability: "In Stock",
    highlights: [
      "Passive Infrared sensing detects thermal radiation of bodies",
      "Detection range: 3 to 7 meters (adjustable)",
      "Delay time adjustment (0.3s to 5 mins) & Trigger modes selection",
      "Low power consumption: static current of 65 microamps",
      "Operating voltage: 4.5V to 20V DC (Output logic is 3.3V)"
    ],
    description: "PIR sensors allow you to sense motion, usually used to detect whether a human has moved in or out of the sensors range. They are small, cheap, low-power, easy to use, and don't wear out, making them ideal for home security alarms.",
    keyFeatures: [
      "Adjustable potentiometers for sensitivity and delay time",
      "Jumper settings for repeatable/non-repeatable trigger modes"
    ],
    specifications: {
      "General": {
        "Operating Voltage": "4.5V - 20V DC",
        "Output Voltage": "3.3V High / 0V Low",
        "Detection Angle": "110 degrees"
      }
    },
    dimensions: "32 mm x 24 mm x 25 mm",
    material: "FR4 Board & Fresnel Dome Lens",
    warranty: "6 Months Technical Warranty",
    images: [board1, extra3, extra5],
    reviews: [
      { id: "sn-r5", userName: "Gaurav K.", rating: 4, date: "2026-06-05", comment: "Highly reliable for light automation. Used it to turn on toilet lights on motion." }
    ]
  },

  // ================= ROBOTICS KITS =================
  {
    id: "kit-1",
    name: "SakRobotix Line Follower Robot DIY Kit",
    brand: "SAKROBOTIX",
    category: "robotics-kits",
    rating: 4.8,
    reviewCount: 240,
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    inStock: true,
    deliveryInfo: "FREE Delivery: Tomorrow, Jun 17 by 11 AM.",
    sku: "SAK-LINE-KIT01",
    availability: "In Stock",
    highlights: [
      "Full DIY educational chassis kit, no soldering required",
      "Includes Arduino UNO board, L298N Motor Driver, and Dual IR sensors",
      "Step-by-step printed manual and online video tutorial links",
      "High torque BO DC motors with rubber-grip wheels",
      "Perfect STEM kit for students and robotics beginners",
      "Runs on standard 9V battery or 6xAA batteries (holder included)"
    ],
    description: "The SAKROBOTIX Line Follower Robot Kit is designed for students, teachers, and makers to get hands-on experience with electronics, coding, and mechanical assemblies. By assembling the robot and programming the controller, you'll learn how infrared light is used to differentiate between black and white surfaces, creating an autonomous vehicle.",
    keyFeatures: [
      "Laser-cut acrylic chassis board with mounting slots",
      "Flexible jumper wire connections, screw terminals for motors"
    ],
    specifications: {
      "General": {
        "Model": "Line-Follow-V1",
        "Target Age": "10+ Years",
        "Microcontroller": "Arduino Uno Compatible",
        "Sensors": "2 x TCRT5000 IR Sensor Modules"
      }
    },
    dimensions: "200 mm x 140 mm x 80 mm",
    material: "Acrylic Plate, Steel, Copper, Rubber",
    warranty: "1 Year Technical Support & Warranty",
    images: [board4, extra4, extra1],
    reviews: [
      { id: "kit-r1", userName: "Priya Das", rating: 5, date: "2026-05-18", comment: "Excellent educational kit. My son assembled it in 2 hours and learned basic programming!" }
    ]
  },
  {
    id: "kit-2",
    name: "SAKROBOTIX 4-DOF Robotic Arm Kit with Servos",
    brand: "SAKROBOTIX",
    category: "robotics-kits",
    rating: 4.7,
    reviewCount: 115,
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    inStock: true,
    deliveryInfo: "FREE Delivery: Friday, Jun 19.",
    sku: "SAK-ARM-4DOF",
    availability: "In Stock",
    highlights: [
      "4-Degrees of Freedom robotic arm with base rotation",
      "Includes 4x SG90 TowerPro metal-gear analog servos",
      "Can be controlled using potentiometers or Bluetooth app",
      "Laser-cut black acrylic parts for structural integrity",
      "Compatible with Arduino, Raspberry Pi, or ESP32 control boards",
      "Detailed wiring diagrams and sample codes provided"
    ],
    description: "Learn mechanical engineering, kinematics, and electronic servo controls with this robotic arm kit. Modelled after industrial pick-and-place robots, this arm has four rotating joints (base, shoulder, elbow, claw) allowing objects to be manipulated in a 3D workspace.",
    keyFeatures: [
      "Rotational base with premium bearings",
      "Mechanical claw grabs items securely"
    ],
    specifications: {
      "General": {
        "Joints": "4 Servo Driven Joints",
        "Servos": "4 x SG90 9g Servos",
        "Payload Capacity": "50g max lift",
        "Reach": "15 cm radius"
      }
    },
    dimensions: "Arm Height: 220 mm (Extended)",
    material: "High Tensile Acrylic & Brass Standoffs",
    warranty: "6 Months Servo Warranty",
    images: [board4, extra2, extra5],
    reviews: [
      { id: "kit-r2", userName: "Nikunj Mehta", rating: 5, date: "2026-06-01", comment: "Fun project! Programmed it to sort marbles by color using an Arduino and color sensor." }
    ]
  },
  {
    id: "kit-3",
    name: "SAKROBOTIX Smart Car Chassis Kit 4WD",
    brand: "SAKROBOTIX",
    category: "robotics-kits",
    rating: 4.5,
    reviewCount: 154,
    price: 799,
    originalPrice: 1599,
    discount: 50,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "SAK-4WD-CAR",
    availability: "In Stock",
    highlights: [
      "4-Wheel Drive acrylic robot platform",
      "Includes 4x BO DC motors and rubber wheels",
      "Speed encoder disks included for optical speed measurement",
      "Pre-drilled mounting holes for sensors, batteries, and controllers",
      "Sturdy 2-layer design to separate batteries from logic boards"
    ],
    description: "A solid chassis platform to build your own obstacle avoidance robot, Bluetooth car, or autonomous mapping vehicle. Dual layers of laser-cut acrylic plates provide plenty of workspace for multiple sensors, batteries, and motor driver boards.",
    keyFeatures: [
      "High traction wheels for quick steering and speed",
      "Tacho disc integration for encoder feedback"
    ],
    specifications: {
      "General": {
        "Drive": "4WD",
        "BO Motors Voltage": "3V - 6V DC",
        "Reduction Ratio": "1:48",
        "Wheel Diameter": "65 mm"
      }
    },
    dimensions: "260 mm x 150 mm x 65 mm",
    material: "Acrylic, Plastic, Rubber, Metal",
    warranty: "6 Months Technical Warranty",
    images: [board4, board1_real, extra3],
    reviews: [
      { id: "kit-r3", userName: "Subho S.", rating: 4, date: "2026-05-12", comment: "Solid plate. Plenty of space to mount batteries, Arduino UNO, motor driver, and custom sensors." }
    ]
  },

  // ================= DEVELOPMENT BOARDS =================
  {
    id: "1",
    name: "BeagleBone Black Rev C Single Board Computer",
    brand: "BeagleBoard",
    category: "development-boards",
    rating: 4.8,
    reviewCount: 384,
    price: 4949,
    originalPrice: 6999,
    discount: 29,
    inStock: true,
    deliveryInfo: "FREE delivery: Friday, Jun 19. Fast delivery: Tomorrow, Jun 17 by 11 AM.",
    sku: "BBB-REV-C03",
    availability: "In Stock",
    highlights: [
      "AM335x 1GHz ARM Cortex-A8 processor",
      "512MB DDR3 RAM",
      "4GB 8-bit eMMC onboard flash storage",
      "3D graphics accelerator & NEON floating-point accelerator",
      "2x PRU 32-bit microcontrollers",
      "Pre-loaded with Debian Linux distribution"
    ],
    description: "The BeagleBone Black Rev C is a low-cost, community-supported development platform for developers and hobbyists. Boot Linux in under 10 seconds and get started on development in less than 5 minutes with just a single USB cable. It offers a rich set of expansion I/O, including Ethernet, USB, HDMI, and double 46-pin headers.",
    keyFeatures: [
      "USB-powered or 5V DC external power source",
      "HDMI output for direct display connection (Micro HDMI)",
      "Compatible with Android, Ubuntu, Cloud9 IDE, Node-RED, and more",
      "Onboard power management IC (PMIC) for clean power delivery"
    ],
    specifications: {
      "General": {
        "Model Name": "BeagleBone Black Rev C",
        "Model Number": "BBB-REV-C",
        "Brand": "BeagleBoard",
        "Type": "Single Board Computer",
        "Color": "Black"
      },
      "Processor": {
        "Processor Core": "ARM Cortex-A8",
        "Clock Speed": "1 GHz",
        "RAM Size": "512 MB DDR3"
      },
      "Storage": {
        "Onboard Storage": "4 GB eMMC",
        "Expandable Storage": "MicroSD slot up to 32 GB"
      },
      "Power & Connectors": {
        "Power Source": "5V DC or USB",
        "USB Ports": "1 x USB 2.0 Client, 1 x USB 2.0 Host",
        "Video Output": "Micro HDMI"
      }
    },
    dimensions: "86.36 mm x 53.34 mm (3.4 in x 2.1 in)",
    material: "FR4 Glass Epoxy Multilayer PCB",
    warranty: "1 Year Manufacturer Warranty against manufacturing defects",
    images: [board1, board1_real, board2, board3, board4, extra1],
    reviews: [
      {
        id: "r1",
        userName: "Ramesh Kumar",
        rating: 5,
        date: "2026-05-12",
        comment: "Excellent board for embedded systems projects. The pre-installed Debian makes setup extremely fast. Highly recommended!",
        images: [extra1, extra2]
      },
      {
        id: "r2",
        userName: "Aditya Sen",
        rating: 4,
        date: "2026-04-20",
        comment: "Very powerful, but has a slight learning curve if you are coming from Arduino. Once configured, it runs flawlessly.",
        images: []
      }
    ]
  },
  {
    id: "2",
    name: "Raspberry Pi 3 Model B+ Board",
    brand: "Raspberry Pi",
    category: "development-boards",
    rating: 4.6,
    reviewCount: 1248,
    price: 3599,
    originalPrice: 4500,
    discount: 20,
    inStock: true,
    deliveryInfo: "FREE delivery: Friday, Jun 19. Fast delivery: Tomorrow, Jun 17 by 11 AM.",
    sku: "RPI-3B-PLUS",
    availability: "In Stock",
    highlights: [
      "Broadcom BCM2837B0, Cortex-A53 64-bit SoC @ 1.4GHz",
      "1GB LPDDR2 SDRAM",
      "2.4GHz and 5GHz IEEE 802.11.b/g/n/ac wireless LAN",
      "Bluetooth 4.2, BLE",
      "Gigabit Ethernet over USB 2.0 (maximum throughput 300 Mbps)",
      "Extended 40-pin GPIO header"
    ],
    description: "The Raspberry Pi 3 Model B+ is the penultimate product in the Raspberry Pi 3 range, boasting a 64-bit quad-core processor running at 1.4GHz, dual-band 2.4GHz and 5GHz wireless LAN, Bluetooth 4.2/BLE, faster Ethernet, and PoE capability via a separate PoE HAT.",
    keyFeatures: [
      "Full-size HDMI port for 1080p display",
      "4 USB 2.0 ports for mouse, keyboard, and storage",
      "MicroSD card port for loading operating system and storing data",
      "CSI camera port for connecting a Raspberry Pi camera",
      "DSI display port for connecting a Raspberry Pi touchscreen display"
    ],
    specifications: {
      "General": {
        "Model Name": "Raspberry Pi 3 Model B+",
        "Model Number": "RPI3-MODBP",
        "Brand": "Raspberry Pi",
        "Type": "Single Board Computer",
        "Color": "Green"
      },
      "Processor & RAM": {
        "Processor Core": "ARM Cortex-A53 (64-bit)",
        "Clock Speed": "1.4 GHz",
        "RAM Size": "1 GB LPDDR2"
      },
      "Connectivity": {
        "Wi-Fi": "Dual-Band 2.4/5GHz 802.11ac",
        "Bluetooth": "Version 4.2 BLE",
        "Ethernet": "Gigabit Ethernet (over USB 2.0)"
      },
      "Power & Connectors": {
        "Power Source": "5V/2.5A DC via Micro USB",
        "HDMI": "1 x Full Size HDMI",
        "GPIO": "40-pin header"
      }
    },
    dimensions: "85 mm x 56 mm x 17 mm",
    material: "FR4 Glass Epoxy Board",
    warranty: "1 Year Official Warranty",
    images: [board2, board2_real, board1, board3, board4, extra2],
    reviews: [
      {
        id: "r4",
        userName: "Vikas P.",
        rating: 5,
        date: "2026-06-01",
        comment: "Excellent device. I turned this into a Pi-hole and media center. Runs continuous 24/7 without heating much.",
        images: [extra4]
      }
    ]
  },
  {
    id: "3",
    name: "Raspberry Pi Zero 2 W",
    brand: "Raspberry Pi",
    category: "development-boards",
    rating: 4.7,
    reviewCount: 512,
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    inStock: true,
    deliveryInfo: "FREE delivery: Friday, Jun 19. COD Available.",
    sku: "RPI-ZERO-2W",
    availability: "In Stock",
    highlights: [
      "1GHz quad-core 64-bit ARM Cortex-A53 CPU",
      "512MB LPDDR2 SDRAM",
      "2.4GHz 802.11 b/g/n wireless LAN",
      "Bluetooth 4.2, Bluetooth Low Energy (BLE)",
      "Mini HDMI port and Micro USB OTG port",
      "HAT-compatible 40-pin unpopulated header footprint"
    ],
    description: "At the heart of Raspberry Pi Zero 2 W is RP3A0, a custom-designed system-in-package developed by Raspberry Pi in the UK. With a quad-core 64-bit ARM Cortex-A53 processor clocked at 1GHz and 512MB of SDRAM, Zero 2 W is up to five times as fast as the original single-core Raspberry Pi Zero.",
    keyFeatures: [
      "Ultra-compact form factor for wearables and small IoT applications",
      "CSI-2 camera connector",
      "Composite video and reset pin solder points",
      "Micro-USB power port"
    ],
    specifications: {
      "General": {
        "Model Name": "Raspberry Pi Zero 2 W",
        "Model Number": "RPI-ZERO-2W",
        "Brand": "Raspberry Pi",
        "Type": "Compact Single Board Computer",
        "Color": "Green"
      },
      "Processor & RAM": {
        "Processor": "RP3A0 System-in-Package",
        "Clock Speed": "1 GHz Quad-core",
        "RAM Size": "512 MB LPDDR2"
      },
      "Connectivity": {
        "Wi-Fi": "2.4GHz 802.11b/g/n",
        "Bluetooth": "Version 4.2 BLE"
      },
      "Ports": {
        "HDMI": "1 x Mini HDMI",
        "USB": "1 x Micro USB OTG",
        "Power": "Micro USB"
      }
    },
    dimensions: "65 mm x 30 mm x 5 mm",
    material: "FR4 Board",
    warranty: "6 Months Official Warranty",
    images: [board3, board3_real, board2, board1, board4, extra3],
    reviews: [
      {
        id: "r6",
        userName: "Suresh S.",
        rating: 5,
        date: "2026-05-29",
        comment: "Insanely small! It runs a full desktop Linux environment. Perfect for smart mirrors or portable handhelds.",
        images: [extra5]
      }
    ]
  },
  {
    id: "4",
    name: "UNO R3 SMD ATmega328P Development Board",
    brand: "Arduino",
    category: "development-boards",
    rating: 4.5,
    reviewCount: 928,
    price: 199,
    originalPrice: 499,
    discount: 60,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500. COD Available.",
    sku: "ARD-UNO-R3SMD",
    availability: "In Stock",
    highlights: [
      "ATmega328P microcontroller with SMD package",
      "14 Digital Input/Output pins (6 can be used as PWM outputs)",
      "6 Analog Inputs, 16 MHz Ceramic Resonator",
      "USB connection, Power jack, ICSP header, and Reset button",
      "Fully compatible with Arduino IDE for code uploading"
    ],
    description: "The Arduino Uno R3 SMD is a microcontroller board based on the ATmega328. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with a AC-to-DC adapter or battery to get started.",
    keyFeatures: [
      "SMD design for cheaper manufacturing and lower height",
      "Robust power management with auto-switching DC/USB input",
      "Standard pin headers for attaching shields and modules easily"
    ],
    specifications: {
      "General": {
        "Model Name": "UNO R3 SMD",
        "Model Number": "UNO-R3-SMD",
        "Brand": "Arduino",
        "Type": "Microcontroller Board",
        "Color": "Blue"
      },
      "Microcontroller": {
        "MCU": "ATmega328P SMD",
        "Operating Voltage": "5V",
        "Input Voltage (Recommended)": "7-12V",
        "Digital I/O Pins": "14 (6 PWM)",
        "Analog Input Pins": "6"
      },
      "Memory": {
        "Flash Memory": "32 KB (0.5 KB used by bootloader)",
        "SRAM": "2 KB",
        "EEPROM": "1 KB",
        "Clock Speed": "16 MHz"
      }
    },
    dimensions: "68.6 mm x 53.4 mm",
    material: "FR4 Board",
    warranty: "6 Months Warranty against manufacturing defects",
    images: [board4, board4_real, board1, board2, board3, extra4],
    reviews: [
      {
        id: "r7",
        userName: "Karthik J.",
        rating: 5,
        date: "2026-06-10",
        comment: "Excellent price point. Very helpful for teaching school kids coding and simple electronics. Works 100% with standard IDE.",
        images: []
      }
    ]
  },
  {
    id: "5",
    name: "STM32F103C8T6 Blue Pill Development Board",
    brand: "STMicroelectronics",
    category: "development-boards",
    rating: 4.4,
    reviewCount: 112,
    price: 249,
    originalPrice: 499,
    discount: 50,
    inStock: true,
    deliveryInfo: "FREE Delivery on orders over ₹500.",
    sku: "STM-F103-BP",
    availability: "In Stock",
    highlights: [
      "ARM Cortex-M3 32-bit core running up to 72MHz frequency",
      "64K Bytes of Flash memory, 20K Bytes of SRAM",
      "Operates on 3.3V power, has 5V tolerant pins",
      "Rich interfaces: 2x I2C, 2x SPI, 3x USART, 1x CAN",
      "Supports programming via ST-Link V2 or USB bootloader"
    ],
    description: "The STM32 Blue Pill development board is a low-cost, high-performance alternative to Arduino boards. Running on a 32-bit ARM Cortex-M3 processor, it is significantly faster and has more memory, peripherals, and GPIO pins than standard 8-bit AVR microcontrollers.",
    keyFeatures: [
      "Onboard micro-USB connector for power and data",
      "8MHz main crystal and 32.768kHz RTC crystal onboard"
    ],
    specifications: {
      "General": {
        "Core": "ARM Cortex-M3 32-bit",
        "Clock Speed": "72 MHz",
        "Flash Memory": "64 KB",
        "SRAM": "20 KB"
      }
    },
    dimensions: "53.3 mm x 22.9 mm",
    material: "FR4 Board",
    warranty: "6 Months Technical Warranty",
    images: [board2, board2_real, board1_real],
    reviews: [
      { id: "stm-r1", userName: "Prakhar S.", rating: 4, date: "2026-05-19", comment: "Highly powerful board, great for high frequency sampling and calculations." }
    ]
  }
];
