const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
}, { timestamps: true 

})


userSchema.statics.signup = async function(username, email, password, role) {


    // validation
    if (!email || !password || !username) {
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email already in use')
    }
    const usernameExists = await this.findOne({ username })
    if (usernameExists) {
        throw Error('Username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, email, password: hash, role })

    return user
}


// static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    return user

}

// Get user profile
userSchema.statics.getProfile = async function(userId) {
    const user = await this.findById(userId).select('-password');
    if (!user) {
        throw Error('User not found');
    }
    return user;
}

// Update user profile
userSchema.statics.updateProfile = async function(userId, updates) {
    const { username, email } = updates;
    
    // Validate fields if provided
    if (email && !validator.isEmail(email)) {
        throw Error('Email not valid');
    }
    
    // Check if email is already in use by another user
    if (email) {
        const emailExists = await this.findOne({ email, _id: { $ne: userId } });
        if (emailExists) {
            throw Error('Email already in use');
        }
    }
    
    // Check if username is already in use by another user
    if (username) {
        const usernameExists = await this.findOne({ username, _id: { $ne: userId } });
        if (usernameExists) {
            throw Error('Username already in use');
        }
    }
    
    const user = await this.findByIdAndUpdate(
        userId,
        { username, email },
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
        throw Error('User not found');
    }
    
    return user;
}

// Change password
userSchema.statics.changePassword = async function(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
        throw Error('All fields must be filled');
    }
    
    if (!validator.isStrongPassword(newPassword)) {
        throw Error('New password not strong enough');
    }
    
    const user = await this.findById(userId);
    if (!user) {
        throw Error('User not found');
    }
    
    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        throw Error('Current password is incorrect');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    user.password = hash;
    await user.save();
    
    return user;
}




module.exports = mongoose.model('User', userSchema)