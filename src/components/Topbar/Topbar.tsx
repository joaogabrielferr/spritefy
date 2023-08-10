import './topbar.scss';

export function Topbar() {
  return (
    <div className="topbar">
      <div className="inner-topbar">
        <div>FILE</div>
        <div
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
        </div>
      </div>
    </div>
  );
}
