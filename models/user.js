const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		index: {
			unique: true,
		},
	},
	password: { type: String, required: true },

	userCreated: {
		type: Date,
		default: Date.now,
	},
	firstName: {
		type: String,
		trim: true,
	},
	lastName: {
		type: String,
		trim: true,
	}

});

UserSchema.pre("save", function (callback) {
	let user = this;

	if (!user.isModified("password")) return callback();

	bcrypt.genSalt(5, function (err, salt) {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserSchema.methods.verifyPassword = function (password, cb) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};


const User = mongoose.model("User", UserSchema);

module.exports = User;
