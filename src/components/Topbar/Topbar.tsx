import './topbar.scss';

export function Topbar({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="topbar">
      <div className="inner-topbar">
        <div>FILE</div>
        <div
          style={{
            width: isMobile ? '100%' : '200px',
            height: '90%',
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center'
          }}>
          Check this project on &nbsp;
          <a href="https://github.com/joaogabrielferr/pixel-art-editor" target="_blank">
            <img height={'24px'} src={`./public/github-mark-white.png`} alt={'github icon'} />
          </a>
        </div>
      </div>
    </div>
  );
}
