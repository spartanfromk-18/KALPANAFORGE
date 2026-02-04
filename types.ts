
export enum AppState {
  LANDING = 'LANDING',
  WORKFLOW_SELECTION = 'WORKFLOW_SELECTION',
  EDITOR = 'EDITOR',
  FEATURES = 'FEATURES',
  ABOUT = 'ABOUT',
  SHOWCASE = 'SHOWCASE',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  GALLERY = 'GALLERY'
}

export type AnimationType = 'NONE' | 'FADE_IN' | 'TYPEWRITER' | 'BOUNCE' | 'SLIDE_UP' | 'PULSE';

export interface TextAnimation {
  type: AnimationType;
  duration: number; // ms
  delay: number; // ms
  loop: boolean;
}

export interface TextLayer {
  id: string;
  name: string; // User-friendly name
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  rotation: number; // Degrees
  opacity: number;
  blendMode: GlobalCompositeOperation;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeColor: string;
  strokeWidth: number;
  letterSpacing: number;
  zIndex: number; // 0 = Behind Subject, 1 = In Front
  animation: TextAnimation;

  // New Properties
  locked: boolean;
  hidden: boolean;
  groupId?: string;

  // Gradient properties
  fillType?: 'SOLID' | 'GRADIENT';
  gradientType?: 'LINEAR' | 'RADIAL';
  gradientStops?: { offset: number; color: string }[];
  gradientAngle?: number;
}

export interface ImageFilters {
  brightness: number; // 100 base
  contrast: number;   // 100 base
  saturation: number; // 100 base
  blur: number;       // 0 base
  grayscale: number;  // 0 base
  sepia: number;      // 0 base
}

export interface EditorState {
  originalImage: string | null;
  maskImage: string | null;
  canvasWidth: number;
  canvasHeight: number;
  aspectRatio: number;
  zoom: number;
  filters: ImageFilters;
}

export interface SavedProject {
  id: string;
  name: string;
  lastModified: number;
  thumbnail: string;
  editorState: EditorState;
  layers: TextLayer[];
}

export enum AspectRatio {
  SQUARE = 1,
  PORTRAIT = 3 / 4,
  LANDSCAPE = 16 / 9,
  STORY = 9 / 16,
  WIDE = 4 / 3,
  POST = 4 / 5,
  CINEMA = 21 / 9
}

export interface FontDef {
  name: string;
  family: string;
  category: 'Display' | 'Sans' | 'Serif' | 'Handwriting' | 'Modern' | 'Custom';
}

export interface Preset {
  id: string;
  name: string;
  thumbnailColor: string;
  styles: Partial<TextLayer>;
}
