import React, { useState } from 'react'
import './CSS/Contact.css'
import { submitContactForm } from '../services/contactService'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Please fill in all fields'
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({
                type: 'error',
                message: 'Please enter a valid email address'
            });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await submitContactForm(formData);
            
            if (response.success) {
                setStatus({
                    type: 'success',
                    message: 'Message sent successfully! We will get back to you soon.'
                });
                
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Failed to send message. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='contact'>
            <div className="contact-container">
                <h1>Contact Us</h1>
                {status.message && (
                    <div className={`contact-status ${status.type}`}>
                        {status.message}
                    </div>
                )}
                <div className="contact-fields">
                    <input 
                        type="text" 
                        name="name"
                        placeholder='Your Name' 
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder='Email Address' 
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <input 
                        type="text" 
                        name="subject"
                        placeholder='Subject' 
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <textarea 
                        name="message"
                        placeholder='Message'
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                    ></textarea>
                </div>
                <button 
                    className='contact-btn' 
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </div>
    )
}

export default Contact
