import { useEffect, useState } from 'react';
import Editor from './components/Editor/Editor';
import './styles/index.scss';
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
import { WelcomeModal } from './components/WelcomeModal/WelcomeModal';

const ToolButtons = [
  { tool: 'pencil', tooltip: 'Pen tool(P or 1)' },
  { tool: 'eraser', tooltip: 'Eraser tool(E or 2)' },
  { tool: 'paintBucket', tooltip: 'Paint bucket(B or 3)' },
  { tool: 'dropper', tooltip: 'Color picker(D or 4)' },
  { tool: 'line', tooltip: 'Pencil stroke line(L or 5)' },
  { tool: 'rectangle', tooltip: 'Rectangle tool(R or 6)' },
  { tool: 'elipse', tooltip: 'Circle tool(G or 7)' },
  { tool: 'selection', tooltip: 'Selection tool(S or 8)' }
] as ToolButtonType[];

//TODO: add option to flip drawing in X and Y axis
//TODO: add option to rotate drawing in clockwise or counter clockwise
//TODO: finish ui on mobile
//TODO: create save drawing modal where user can choose to download sprite as png or as gif
//TODO: Draw better tool icons
//TODO: Add a 'file' option in header and add option to create new drawing
//TODO: allow for different width and height when creating a new canvas
//TODO: Fix frames and preview disappearing after changing to mobile
//TODO: implement a more precise zoom for mobile
//TODO: right now im saving the gifs with a white background because i couldnt figure out how to create transparent gifs with gif.js,
//probably look for another library that supports transparent bg (or keep it white, pixilart also saves gifs with white bg so transparent bg may not be easy to achieve)

//TODO: add layers functionality (maybe have a list 'layers' in a scene and each layer has a pixel matrix)
//TODO: save drawing locally (maybe by retrieving the image from canvases with getImageData? )
//TODO: add option to save drawing on users computer (create a json file and store all necessary info to redraw elements, save it as .spritefy)
//TODO: Add onion skin
//TODO: Add tutorial if opened for the first time

//TODO:create option to select palettes and switch between them

//TODO: add new options for paint bucket:
// paint diagonal neighbors
//erase pixels instead of painting
//change color of all pixels with the start colors

//TODO: add new options for color picker:
// choose as current color (default)
// add to palette

function App() {
  const selectedTool = store((state: StoreType) => state.selectedTool);

  const selectedColor = store((state: StoreType) => state.selectedColor);

  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  const setDisplaySize = store((state: StoreType) => state.setDisplaySize);

  const [cssCanvasSize, setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  const [isLeftSidebarMobileOpen, setIsLeftSidebarMobileOpen] = useState(false);
  const [isRightSidebarMobileOpen, setIsRightSidebarMobileOpen] = useState(false);

  function handleOnCloseWelcomeModal(displaySize: number) {
    setDisplaySize(displaySize);
    setIsWelcomeModalOpen(false);
  }

  useEffect(() => {
    if (isMobile) setCssCanvasSize(window.innerWidth);

    function handleWindowResize() {
      console.log(window.innerHeight);
      EventBus.getInstance().publish(RESET_CANVAS_POSITION);

      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return function () {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [cssCanvasSize, isMobile]);

  function handleChangeSelectedColor(color: ColorResult) {
    setSelectedColor(color.hex);
  }

  const ColorPicker = CustomPicker(CustomColorPicker);

  return (
    <>
      <main>
        <Header isMobile={isMobile} />
        {/* <div style={{ width: '100%', height: '20px', backgroundColor: 'rgb(77, 77, 77)' }}>teste</div> */}
        <section className="main-section">
          <div className="main-inner-wrapper">
            {/* left sidebar */}
            {
              <Sidebar isMobile={isMobile} isOpen={isLeftSidebarMobileOpen} toogleSidebarOnMobile={setIsLeftSidebarMobileOpen}>
                <Toolbar toolButtons={ToolButtons} isMobile={isMobile} isWelcomeModalOpen={isWelcomeModalOpen} />
                <div className="sidebar-item">
                  <ColorPicker color={selectedColor} onChange={handleChangeSelectedColor} />
                </div>
                <div className="sidebar-item">
                  <Palettes></Palettes>
                </div>
              </Sidebar>
            }

            <div
              style={
                !isMobile
                  ? { height: 'calc(100vh - 30px)', width: '100%', position: 'relative' }
                  : { height: '50vh', width: '100%' }
              }>
              {/* main editor */}
              <Editor cssCanvasSize={cssCanvasSize} isMobile={isMobile}></Editor>
              {!isMobile && (
                <div
                  style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: 10,
                    height: '40px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    zIndex: 10000000
                  }}>
                  <span
                    id="coordinates"
                    style={{
                      height: '100%',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {'[X:0,Y:0]'}
                  </span>
                </div>
              )}
            </div>

            {/* right sidebar */}
            {!isMobile && (
              <Sidebar isMobile={isMobile} isOpen={isRightSidebarMobileOpen} toogleSidebarOnMobile={setIsRightSidebarMobileOpen}>
                <Preview />
                <Frames />
              </Sidebar>
            )}
          </div>

          {isMobile && (
            <div className="mobile-options">
              <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                <button style={{ width: '80px', height: '50px' }} onClick={() => setIsLeftSidebarMobileOpen((prev) => !prev)}>
                  {selectedTool}
                </button>
                <button style={{ width: '80px', height: '50px' }}>
                  <span style={{ backgroundColor: selectedColor, padding: '10px', width: '100%', height: '100%' }}>teste</span>
                </button>
                <button style={{ width: '80px', height: '50px' }}>FRAMES</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                <button>UNDO</button>
                <button>REDO</button>
                <button>RESET POSITION</button>
              </div>
            </div>
          )}
        </section>
        {!isMobile && <Tooltip id="my-tooltip" place="bottom" style={{ zIndex: 9999, backgroundColor: '#634cb8' }} />}
        {!isMobile && (
          <Tooltip id="my-tooltip-extra-options" place="right" style={{ zIndex: 9999, backgroundColor: '#634cb8' }} />
        )}
      </main>
      {isWelcomeModalOpen && <WelcomeModal onCloseModal={handleOnCloseWelcomeModal}></WelcomeModal>}
    </>
  );
}

export default App;
