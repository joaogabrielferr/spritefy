//TODO: remove canvas_size from here, canvas size will be defined by the user
export const CANVAS_SIZE = 128; //TODO: Set CANVAS_SIZE as state, if the value changes, update variables and pixel matrix
export const SCALE_FACTOR = 0.15;
export const MAX_ZOOM_AMOUNT = 40;
export const CIRCLE_RADIUS_INCREASE_FACTOR = 0.3;
export const UNDO_LAST_DRAW = 'undo-last-draw';
export const REDO_LAST_dRAW = 'redo-last-draw';
export const ERASING = 'erasing';
export const TOP_CANVAS = 'topCanvas';
export const BACKGROUND_CANVAS = 'backgroundCanvas';

export const BG_COLORS = ['#757474','#a1a1a1'];

//events
export const RESET_CANVAS_POSITION = 'reset-canvas-position';
export const DRAW_ON_SIDEBAR_CANVAS = 'draw-on-sidebar-canvas';
export const SELECT_LAYER = 'select-layer';
export const CREATE_NEW_LAYER = 'create-new-canvas';