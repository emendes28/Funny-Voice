import { h } from 'preact';
import style from './style';
import { Link } from 'preact-router/match';

const Header = () => (
  <header class={style.header}>
    <h1>Vozes</h1>
    <nav>
      <Link activeClassName={style.active} href="/">
        Voz
      </Link>
      <Link activeClassName={style.active} href="/lista">
        Clips
      </Link>
    </nav>
  </header>
);

export default Header;
