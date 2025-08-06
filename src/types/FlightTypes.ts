export interface FlightState {
  // Aircraft state
  altitude: number;
  speed: number;
  heading: number;
  pitch: number;
  roll: number;
  yaw: number;
  
  // Engine state
  engine1RPM: number;
  engine2RPM: number;
  engine1Throttle: number;
  engine2Throttle: number;
  engine1Temp: number;
  engine2Temp: number;
  engine1Oil: number;
  engine2Oil: number;
  
  // Systems
  landingGear: 'UP' | 'DOWN';
  flaps: number;
  brakes: boolean;
  lights: {
    landing: boolean;
    navigation: boolean;
    strobe: boolean;
    beacon: boolean;
  };
  
  // Flight mode
  isOnGround: boolean;
  isEngineRunning: boolean;
  isGearDown: boolean;
  isFlapsDown: boolean;
  
  // Position
  latitude: number;
  longitude: number;
  groundSpeed: number;
  verticalSpeed: number;
}

export interface FlightSimulatorProps {
  flightState: FlightState;
  currentView: 'cockpit' | 'external' | 'chase';
  style?: any;
}

export interface CockpitControlsProps {
  flightState: FlightState;
  onEngineStart: () => void;
  onEngineStop: () => void;
  onGearToggle: () => void;
  onFlapsToggle: () => void;
  onThrottleChange: (engine: 1 | 2, value: number) => void;
  onViewChange: (view: 'cockpit' | 'external' | 'chase') => void;
  style?: any;
}

export interface FlightDataProps {
  flightState: FlightState;
  style?: any;
}

export interface Aircraft3DProps {
  flightState: FlightState;
  style?: any;
}

export interface InstrumentProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color?: string;
  style?: any;
}

export interface ThrottleControlProps {
  engine: 1 | 2;
  value: number;
  onChange: (engine: 1 | 2, value: number) => void;
  style?: any;
} 