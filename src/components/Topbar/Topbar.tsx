import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './topbar.scss';
import { faArrowRotateLeft, faBroom, faDownload, faFile, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { EventBus } from '../../EventBus';
import { CLEAR_DRAWING, REDO_LAST_DRAW, START_NEW_DRAWING, UNDO_LAST_DRAW } from '../../utils/constants';

export function Topbar() {
  return (
    <div className="topbar">
      <div className="inner-topbar">
        <nav className="topbar-nav">
          <button onClick={() => EventBus.getInstance().publish(START_NEW_DRAWING)}>
            <FontAwesomeIcon size="lg" color="white" icon={faFile} /> NEW DRAWING
          </button>
          <button onClick={() => EventBus.getInstance().publish(CLEAR_DRAWING)}>
            <FontAwesomeIcon size="lg" color="white" icon={faBroom} />
            CLEAR DRAWING
          </button>
          {/* <button
            onClick={() => {
              EventBus.getInstance().publish(UNDO_LAST_DRAW);
            }}>
            <FontAwesomeIcon size="lg" color="#abbbc7" icon={faArrowRotateLeft} />
            UNDO
          </button>
          <button
            onClick={() => {
              EventBus.getInstance().publish(REDO_LAST_DRAW);
            }}>
            <FontAwesomeIcon size="lg" color="#abbbc7" icon={faRotateRight} />
            REDO
          </button> */}
          <button className="topbar-download">
            <FontAwesomeIcon size="lg" color="#abbbc7" icon={faDownload} />
            SAVE DRAWING
          </button>
        </nav>

        {/* <div
          style={{
            width: '200px',
            height: '90%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
          Check this project on &nbsp;
          <a href="https://github.com/joaogabrielferr/pixel-art-editor" target="_blank">
            <img height={'20px'} src={`./public/github-mark-white.png`} alt={'github icon'} />
          </a>
        </div> */}
      </div>
    </div>
  );
}
