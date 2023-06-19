//TODO: remove canvas_size from here, canvas size will be defined by the user
export const CANVAS_SIZE = 128; //TODO: Set CANVAS_SIZE as state, if the value changes, update variables and pixel matrix
export const SCALE_FACTOR = 0.15;
export const MAX_ZOOM_AMOUNT = 40;
export const CIRCLE_RADIUS_INCREASE_FACTOR = 0.3;
export const ERASING = 'erasing';
export const TOP_CANVAS = {canvas:'topCanvas',visible:true,blocked:false};
export const BACKGROUND_CANVAS = {canvas:'backgroundCanvas',visible:true,blocked:false};

export const BG_COLORS = ['#757474','#a1a1a1'];

//pub sub events
export const RESET_CANVAS_POSITION = 'reset-canvas-position';
export const DRAW_ON_SIDEBAR_CANVAS = 'draw-on-sidebar-canvas';
export const SELECT_FRAME = 'select-layer';
export const CREATE_NEW_FRAME = 'create-new-frame';
export const DELETE_FRAME = 'delete-frame';
export const UPDATE_PREVIEW_FRAMES = 'update-preview-frames';
export const COPY_FRAME = 'copy-frame';
export const SWAP_FRAMES = 'swap-frames';
export const UNDO_LAST_DRAW = 'undo-last-draw';
export const REDO_LAST_DRAW = 'redo-last-draw';