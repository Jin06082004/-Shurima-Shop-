const User = require('./user.model');

module.exports = {
    CreateAnUser: async function (authId, name, phone, address, session) {
        let newUser = new User({ auth: authId, name, phone, address });
        if (session) return await newUser.save({ session });
        return await newUser.save();
    },
    GetAllUser: async function () {
        return await User.find().populate('auth', '-password');
    },
    GetUserById: async function (id) {
        return await User.findById(id).populate('auth', '-password');
    },
    GetUserByAuthId: async function (authId) {
        return await User.findOne({ auth: authId }).populate('auth', '-password');
    },
    UpdateUser: async function (id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    },
    DeleteUser: async function (id) {
        return await User.findByIdAndDelete(id);
    }
};
