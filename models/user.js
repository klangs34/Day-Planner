const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
});

//add middleware to encrypt the password using a hook
UserSchema.pre('save', async function(next){
	try {
		if(!this.isModified('password')){
			return next();
		}
		let hashedPassword = await bcrypt.hash(this.password, 5);
		this.password = hashedPassword;
		return next();
	} catch (error) {
		return next(error);	
	}
});

//compare password
UserSchema.methods.comparePassword = async function(candidatePassword, next) {
	try {
		let isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;

	} catch (error) {
		return next(error);
	}
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
