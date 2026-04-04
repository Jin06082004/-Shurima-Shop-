const User = require('./user.model');

module.exports = {
    CreateAnUser: async function (name, phone, address, session) {
        let newUser = new User({ name, phone, address });
        if (session) return await newUser.save({ session });
        return await newUser.save();
    },
    GetAllUser: async function () {
        return await User.find().select('-password');
    },
    GetUserById: async function (id) {
        return await User.findById(id).select('-password');
    },
    UpdateUser: async function (id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    },
    DeleteUser: async function (id) {
        return await User.findByIdAndDelete(id);
    }
};
