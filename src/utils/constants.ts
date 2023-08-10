export const SCALE_FACTOR = 0.15;
export const MAX_ZOOM_AMOUNT = 70;
export const CIRCLE_RADIUS_INCREASE_FACTOR = 0.3;
export const ERASING = 'erasing';
export const EDITOR_SIZE_OFFSET = 350;
export const EDITOR_SIZE_OFFSET_MOBILE = 200;
export const BG_TILE_SIZE = 16;
// export const TOP_CANVAS = { canvas: 'topCanvas', visible: true, blocked: false };
// export const BACKGROUND_CANVAS = { canvas: 'backgroundCanvas', visible: true, blocked: false };

export const BG_COLORS = ['#757474', '#a1a1a1'];

//pub sub events
export const RESET_CANVAS_POSITION = 'reset-canvas-position';
export const DRAW_ON_SIDEBAR_CANVAS = 'draw-on-sidebar-canvas';
export const SELECT_FRAME = 'select-layer';
export const CREATE_NEW_FRAME = 'create-new-frame';
export const DELETE_FRAME = 'delete-frame';
export const UPDATE_FRAMES_REF_ON_FRAMES_LIST_BAR = 'update-frames-list-frame';
export const UPDATE_FRAMES_REF_ON_PREVIEW = 'update-preview-frames';
export const COPY_FRAME = 'copy-frame';
export const SWAP_FRAMES = 'swap-frames';
export const UNDO_LAST_DRAW = 'undo-last-draw';
export const REDO_LAST_DRAW = 'redo-last-draw';
export const CLEAR_TOP_CANVAS = 'clear-top-canvas';
export const COPY_SELECTED_DRAW = 'copy-selected-draw';
export const PASTE_SELECTED_DRAW = 'paste-selected-draw';
export const DELETE_SELECTED_DRAW = 'delete-selected-draw';
export const CLEAR_DRAWING = 'clear-drawing';
