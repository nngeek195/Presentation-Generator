import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.png';
import './Header.css';

const Header = () => (
  <header className="intro-header">
    <img src={Logo} alt="Logo" className="intro-header-logo" />
    <nav className="intro-header-nav">
    </nav>
  </header>
);

export default Header;