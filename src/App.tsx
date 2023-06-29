import { useEffect, useState } from 'react';
import Editor from './Editor';
import './index.scss';
import { ColorResult, CustomPicker } from 'react-color';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ToolButtonType } from './types';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Palettes } from './components/Palettes/Palettes';
import { Header } from './components/Header/Header';
import { Tooltip } from 'react-tooltip';
import CustomColorPicker from './components/ColorPicker/ColorPicker';
import { EventBus } from './EventBus';
import { RESET_CANVAS_POSITION } from './utils/constants';
import { store, StoreType } from './store';
import { Frames } from './components/Frames/Frames';
import { Preview } from './components/Preview/Preview';

const ToolButtons = [
  {
    tool: 'pencil',
    tooltip: 'Pen tool(P or 1)'
  },
  {
    tool: 'eraser',
    tooltip: 'Eraser tool(E or 2)'
  },
  { tool: 'paintBucket', tooltip: 'Paint bucket(B or 3)' },
  {
    tool: 'dropper',
    tooltip: 'Color picker(D or 4)'
  },
  { tool: 'line', tooltip: 'Pencil stroke line(L or 5)' },
  { tool: 'rectangle', tooltip: 'Rectangle tool(R or 6)' },
  { tool: 'elipse', tooltip: 'Circle tool(C or 7)' }
] as ToolButtonType[];

//TODO: right now im saving the gifs with a white background because i couldnt figure out how to create transparent gifs with gif.js,
//probably look for another library that supports transparent bg (or keep it white, pixilart also saves gifs with white bg so transparent bg may not be easy to achieve)
//TODO: add pixel_size and display_size as global states (and stop using CANVAS_SIZE)
//TODO: add layers functionality (maybe have a list 'layers' in a scene and each layer has a pixel matrix)
//TODO: add eslint to project
//TODO: add styled components
//TODO: save drawing locally by retrieving the image from canvases with getImageData
//TODO: Add onion skin
//TODO: Add tutorial if opened for the first time
//TODO: Add license page to add licenses of libs used (tabler-icon)

// paint bucket:
// diagonal neighbors
//erase pixels instead of painting
//change color of all pixels with the start colors

// color picker:
// choose as current color
// add to palette

function App() {
  const selectedColor = store((state: StoreType) => state.selectedColor);
  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  const [cssCanvasSize, setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device

  function handleWindowResize() {
    setCssCanvasSize(window.innerHeight - 20);

    EventBus.getInstance().publish(RESET_CANVAS_POSITION);

    if (window.innerWidth <= 768) {
      setCssCanvasSize(window.innerWidth);
    }

    setIsMobile(window.innerWidth <= 768);
  }

  useEffect(() => {
    if (isMobile) setCssCanvasSize(window.innerWidth);
    else setCssCanvasSize(window.innerHeight - 20);

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return function () {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isMobile]);

  function handleChangeSelectedColor(color: ColorResult) {
    setSelectedColor(color.hex);
  }

  const ColorPicker = CustomPicker(CustomColorPicker);

  return (
    <main>
      <Header isMobile={isMobile} />
      <section className="main-section">
        <div className="main-inner-wrapper">
          {/* left sidebar */}
          {!isMobile && (
            <Sidebar width={240} height={cssCanvasSize}>
              <Toolbar toolButtons={ToolButtons} isMobile={isMobile} />
              <div className="sidebar-item">
                <ColorPicker color={selectedColor} onChange={handleChangeSelectedColor} />
              </div>
              <div className="sidebar-item">
                <Palettes></Palettes>
              </div>
            </Sidebar>
          )}

          <div style={{ width: '100%', height: cssCanvasSize }}>
            {/* main editor */}
            <Editor cssCanvasSize={cssCanvasSize - 40} isMobile={isMobile}></Editor>
            <div
              style={{
                backgroundColor: 'rgb(28, 34, 48)',
                height: '40px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontSize: '15px'
              }}>
              <span
                id="coordinates"
                style={{
                  height: '100%',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}></span>
            </div>
          </div>

          {/* right sidebar */}
          {!isMobile && (
            <Sidebar width={300} height={cssCanvasSize}>
              <Preview />
              <Frames />
            </Sidebar>
          )}
        </div>

        {isMobile && (
          <div className="mobile-options">
            {/* <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/> */}
            <Toolbar toolButtons={ToolButtons}></Toolbar>
          </div>
        )}
      </section>
      {!isMobile && (
        <Tooltip
          id="my-tooltip"
          place="bottom"
          style={{ zIndex: 9999, backgroundColor: '#634cb8' }}
        />
      )}
      {!isMobile && (
        <Tooltip
          id="my-tooltip-extra-options"
          place="right"
          style={{ zIndex: 9999, backgroundColor: '#634cb8' }}
        />
      )}
    </main>
  );
}

export default App;
