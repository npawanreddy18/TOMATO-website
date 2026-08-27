import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Tomato is a fast, simple, and convenient online food delivery platform that brings your favorite meals straight to your doorstep. Explore a wide variety of delicious dishes, add your favorite food to the cart, place your order easily, and enjoy fast and reliable delivery. With Tomato, great food is just a few clicks away!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About US</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li> Contect.Num : 91+998-898-9999</li>
                <li> Contect.Email : @tomato.com</li>
            </ul>

         </div>
      </div>
      <hr />
       <p className="footeer-copyright">Copyright 2026 @tomato.com - All Rightt Reserved.</p>
    </div>
  )
}

export default Footer
