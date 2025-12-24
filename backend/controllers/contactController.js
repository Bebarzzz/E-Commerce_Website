const contactModel = require('../Models/contactModel');
const jwt = require('jsonwebtoken');

const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Try to get userID from JWT token if available
        let userID = null;
        const { authorization } = req.headers;
        
        if (authorization) {
            try {
                const token = authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userID = decoded._id;
            } catch (error) {
                console.log('Token verification failed, proceeding without userID:', error.message);
            }
        }
        
        const contact = await contactModel.createContact({
            name,
            email,
            subject,
            message,
            userID
        });
        
        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            contact: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactModel.getAllContacts();
        
        res.status(200).json({
            success: true,
            contacts: contacts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }
        
        const contact = await contactModel.updateContactStatus(id, status);
        
        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            contact: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    updateContactStatus
};
