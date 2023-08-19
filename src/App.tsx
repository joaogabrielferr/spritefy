import { useEffect, useState } from 'react';
import Editor from './components/Editor/Editor';
import './styles/index.scss';
import { ColorResult, CustomPicker } from 'react-color';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ToolOptions } from './components/ToolOptions/ToolOptions';
import { Palettes } from './components/Palettes/Palettes';
import { Header } from './components/Header/Header';
import { Tooltip } from 'react-tooltip';
import { EventBus } from './EventBus';
import { CLOCKWISE_ROTATION, FLIP_X, FLIP_Y, RESET_CANVAS_POSITION } from './utils/constants';
import { store, StoreType } from './store';
import { Frames } from './components/Frames/Frames';
import { Preview } from './components/Preview/Preview';
import { WelcomeModal } from './components/WelcomeModal/WelcomeModal';
import { Toolbar } from './components/Toolbar/Toolbar';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { IconFlipHorizontal, IconFlipVertical } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons';
import { HexColorPicker } from 'react-colorful';

//TODO: save drawing on browser (maybe save png and then parse)
//TODO: add option to flip drawing in X and Y axis
//TODO: add option to rotate drawing in clockwise or counter clockwise
//TODO: allow for different width and height when creating a new canvas
//TODO: implement a more precise zoom for mobile
//TODO: right now im saving the gifs with a white background because i couldnt figure out how to create transparent gifs with gif.js,
//probably look for another library that supports transparent bg (or keep it white, pixilart also saves gifs with white bg so transparent bg may not be easy to achieve)

//TODO: add layers functionality
//TODO:create option to select palettes and switch between them

//TODO: add new options for paint bucket:
//erase pixels instead of painting
//change color of all pixels with the start color

//TODO: add new option to square
//fill

//TODO: add new options to eraser and line
//mirror x and mirror y

//TODO: add new options for color picker:
// choose as current color (default)
// add to palette

function App() {
  const selectedColor = store((state: StoreType) => state.selectedColor);

  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  const setDisplaySize = store((state: StoreType) => state.setDisplaySize);

  const isWelcomeModalOpen = store((state: StoreType) => state.isWelcomeModalOpen);

  const setIsWelcomeModalOpen = store((state: StoreType) => state.setIsWelcomeModalOpen);

  const [cssCanvasSize, setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device

  const [isToolbarMobileOpen, setIsToolbarMobileOpen] = useState(false);

  const [isLeftSidebarMobileOpen, setIsLeftSidebarMobileOpen] = useState(false);

  const [isRightSidebarMobileOpen, setIsRightSidebarMobileOpen] = useState(false);

  function handleOnCloseWelcomeModal(displaySize: number) {
    setDisplaySize(displaySize);
    setIsWelcomeModalOpen(false);
  }

  useEffect(() => {
    if (!isMobile) {
      setCssCanvasSize(window.innerHeight - window.innerHeight * 0.1);
    }

    if (isMobile) setCssCanvasSize(window.innerWidth);

    function handleWindowResize() {
      EventBus.getInstance().publish(RESET_CANVAS_POSITION);
      if (!isMobile) {
        setCssCanvasSize(window.innerHeight - 200);
      }

      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return function () {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isMobile]);

  function handleChangeSelectedColor(color: ColorResult) {
    setSelectedColor(color.hex);
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header isMobile={isMobile} />
      {/* <Topbar isMobile={isMobile} /> */}
      <section className="main-section">
        <div className="main-inner-wrapper">
          <Toolbar
            isMobile={isMobile}
            isWelcomeModalOpen={isWelcomeModalOpen}
            isToolbarMobileOpen={isToolbarMobileOpen}
            toogleToolbarMobile={setIsToolbarMobileOpen}
          />

          <div style={!isMobile ? { height: '100%', width: '100%', position: 'relative' } : { width: '100%', height: '100%' }}>
            <Editor cssCanvasSize={cssCanvasSize} isMobile={isMobile}></Editor>
            {!isMobile && <Coordinates />}
          </div>

          <Sidebar
            isMobile={isMobile}
            isOpen={isLeftSidebarMobileOpen}
            toogleSidebarOnMobile={setIsLeftSidebarMobileOpen}
            side="left">
            {!isMobile && (
              <div className="sidebar-item">
                <Preview />
              </div>
            )}
            <ToolOptions isMobile={isMobile} isWelcomeModalOpen={isWelcomeModalOpen} />
            <div className="sidebar-item">
              <Transform />
            </div>
            <div className="sidebar-item">
              {/* <div
                style={{
                  width: '200px',
                  height: '200px',
                  zIndex: '100000'
                }}>
                <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
              </div> */}
            </div>
          </Sidebar>

          {!!isMobile && (
            <Sidebar
              isMobile={isMobile}
              isOpen={isRightSidebarMobileOpen}
              toogleSidebarOnMobile={setIsRightSidebarMobileOpen}
              side="right">
              <div className="sidebar-item">
                <Preview />
              </div>
              <div className="sidebar-item">
                <Frames isMobile={isMobile}></Frames>
              </div>
            </Sidebar>
          )}

          {isMobile ? (
            <MobileMenu
              setIsToolbarMobileOpen={setIsToolbarMobileOpen}
              setIsLeftSidebarMobileOpen={setIsLeftSidebarMobileOpen}
              setIsRightSidebarMobileOpen={setIsRightSidebarMobileOpen}
            />
          ) : null}
        </div>
      </section>
      {!isMobile && (
        <div style={{ width: '100%', height: '100px', display: 'flex' }}>
          <Frames isMobile={isMobile} />
        </div>
      )}
      {!isMobile && <Tooltip id="my-tooltip" place="right" style={{ zIndex: 9999, backgroundColor: '#2e148b' }} />}
      {!isMobile && <Tooltip id="my-tooltip-extra-options" place="right" style={{ zIndex: 9999, backgroundColor: '#2e148b' }} />}
      {!isMobile && <Tooltip id="my-tooltip-transform" place="left" style={{ zIndex: 9999, backgroundColor: '#2e148b' }} />}
      {isWelcomeModalOpen && <WelcomeModal onCloseModal={handleOnCloseWelcomeModal}></WelcomeModal>}
    </main>
  );
}

export default App;

function Coordinates() {
  return (
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
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 9998,
        userSelect: 'none'
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
  );
}

function Transform() {
  return (
    <div style={{ width: '95%', marginTop: '5px' }}>
      <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold', width: '100%' }}>TRANSFORM</div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', margin: '10px 0 10px 0' }}>
        <button
          style={{ width: '50px', height: '50px', borderStyle: 'none', cursor: 'pointer', backgroundColor: '#333333' }}
          data-tooltip-id="my-tooltip-transform"
          data-tooltip-content={'Flip in X axis'}
          onClick={() => EventBus.getInstance().publish(FLIP_X)}>
          <IconFlipVertical size={'30'} color="#97a2aa" />
        </button>
        <button
          style={{ width: '50px', height: '50px', borderStyle: 'none', cursor: 'pointer', backgroundColor: '#333333' }}
          data-tooltip-id="my-tooltip-transform"
          data-tooltip-content={'Flip in Y axis'}
          onClick={() => EventBus.getInstance().publish(FLIP_Y)}>
          <IconFlipHorizontal size={'30'} color="#97a2aa" />
        </button>
        <button
          style={{ width: '50px', height: '50px', borderStyle: 'none', cursor: 'pointer', backgroundColor: '#333333' }}
          data-tooltip-id="my-tooltip-transform"
          data-tooltip-content={'Clockwise rotation'}
          onClick={() => EventBus.getInstance().publish(CLOCKWISE_ROTATION)}>
          <FontAwesomeIcon size={'2x'} color="#97a2aa" icon={faArrowsSpin} />
        </button>
      </div>
    </div>
  );
}
