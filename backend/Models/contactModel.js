const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true });

contactSchema.statics.createContact = async function(contactData) {
    const { name, email, subject, message, userID } = contactData;
    
    if (!name || !email || !subject || !message) {
        throw new Error('All fields are required');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    
    const contact = await this.create({
        name,
        email,
        subject,
        message,
        userID,
        status: 'new'
    });
    
    return contact;
};

contactSchema.statics.getAllContacts = async function() {
    const contacts = await this.find({}).sort({ createdAt: -1 });
    return contacts;
};

contactSchema.statics.updateContactStatus = async function(contactId, newStatus) {
    const validStatuses = ['new', 'read', 'replied'];
    
    if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid contact status');
    }
    
    const contact = await this.findByIdAndUpdate(
        contactId,
        { status: newStatus },
        { new: true, runValidators: true }
    );
    
    if (!contact) {
        throw new Error('Contact message not found');
    }
    
    return contact;
};

module.exports = mongoose.model('Contact', contactSchema);
