import './header.scss';

export function Header() {
  return (
    <header className="header">
      <div className="inner-header">
        <div style={{ fontWeight: 'bold' }}>
          <img height={'16px'} style={{ imageRendering: 'pixelated' }} src={`./public/logo.png`} alt={'logo'} />
          PRITEFY
        </div>
        <div
          style={{
            width: '200px',
            height: '90%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
          <a
            href="https://github.com/joaogabrielferr/pixel-art-editor"
            target="_blank"
            style={{ textDecoration: 'none', color: 'white' }}>
            Check this project on &nbsp;
            <img height={'20px'} src={`./public/github-mark-white.png`} alt={'github icon'} />
          </a>
        </div>
      </div>
    </header>
  );
}
