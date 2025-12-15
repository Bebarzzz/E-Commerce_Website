import React from 'react'
import './CSS/Contact.css'

const Contact = () => {
    return (
        <div className='contact'>
            <div className="contact-container">
                <h1>Contact Us</h1>
                <div className="contact-fields">
                    <input type="text" placeholder='Your Name' />
                    <input type="email" placeholder='Email Address' />
                    <input type="text" placeholder='Subject' />
                    <textarea placeholder='Message'></textarea>
                </div>
                <button className='contact-btn'>Send Message</button>
            </div>
        </div>
    )
}

export default Contact
