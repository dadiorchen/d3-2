export const scaleType = {
  LINEAR: 'linear',
  BAND: 'band',
  POINT: 'point',
  ORDINAL: 'ordinal',
};

export const SCALE = {
  X: 'X',
  Y: 'Y',
};

export const AVAILABLE_Y_FORMATS = ['percent', 'linear', 'time', 'band'];
export const AVAILABLE_Y_FORMATS_BAR = ['percent', 'linear'];
export const AVAILABLE_X_FORMATS = ['time', 'band', 'percent', 'linear'];
export const AVAILABLE_X_FORMATS_BAR = ['time', 'band'];
export const AVAILABLE_GRAPHS = ['bar', 'line', 'point'];
export const CURVE_TYPES = [
  'curve linear',
  'curve monotone x',
  'curve monotone y',
  'curve basis',
  'curve natural',
  'curve step',
];

export const SVG = {
  HEIGHT: 600,
  WIDTH: 800,
  MARGIN: {
    left: 100,
    right: 10,
    bottom: 125,
    top: 40,
  },
};

export const IS_CSV = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;

export const DEFAULT_PROPERTIES = {
  CIRCLE_RADIUS: 7,
};

export const LINE_STROKE_WIDTH = {
  THIN: '1.5',
  FAT: '3',
};

export const COLORS = {
  PRIMARY_BLUE: '#4291F1',
  BLACK: '#000000',
  WHITE: '#ffffff',
  SMOOTH_PINK: '#DB7093',
  LIGHT_GREY: '#D3D3D3',
  GREY: '#808080',
  STEEL_BLUE: '#4682b4',
};
