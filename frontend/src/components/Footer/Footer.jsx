import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const go = (id) => { if (location.pathname !== '/') { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80); } else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="footer-logo" src={assets.logo} alt="Tomato" />
          <p>Tomato is a fast, simple, and convenient online food delivery platform that brings your favourite meals straight to your doorstep.</p>
          <div className="footer-social-icons"><img src={assets.facebook_icon} alt="Facebook" /><img src={assets.twitter_icon} alt="Twitter" /><img src={assets.linkedin_icon} alt="LinkedIn" /></div>
        </div>
        <div className="footer-content-center"><h2>COMPANY</h2><button onClick={() => go('header')}>Home</button><button onClick={() => go('explore-menu')}>Menu</button><button onClick={() => go('app-download')}>Mobile App</button><button onClick={() => go('footer')}>Privacy Policy</button></div>
        <div className="footer-content-right"><h2>GET IN TOUCH</h2><p>Contact: +91 998-898-9999</p><p>Email: support@tomato.com</p></div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © Tomato.com - All Rights Reserved.</p>
    </footer>
  );
};
export default Footer;
