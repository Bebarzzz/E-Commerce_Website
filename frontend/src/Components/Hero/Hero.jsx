import React from 'react'
import './Hero.css'
import hero_image from '../Assets/hero_image.png'
import arrow_icon from '../Assets/arrow.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>RevNRun</h2>
        <div>
          <p>Drive</p>
          <p>your dream</p>
          <p>car today</p>
        </div>
        <Link to='/new-cars' style={{ textDecoration: 'none' }}>
          <div className="hero-latest-btn">
            <div>Latest Models</div>
            <img src={arrow_icon} alt="" />
          </div>
        </Link>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero