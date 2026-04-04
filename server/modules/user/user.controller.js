const userService = require('./user.service');
const { createUserSchema, updateUserSchema } = require('./user.validation');

module.exports = {
    // POST /user
    create: async (req, res) => {
        try {
            const { error } = createUserSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });
            
            const { authId, name, phone, address } = req.body;
            const newUser = await userService.CreateAnUser(authId, name, phone, address);
            res.status(201).json({ status: 'success', data: newUser });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /user
    getAll: async (req, res) => {
        try {
            const users = await userService.GetAllUser();
            res.status(200).json({ status: 'success', data: users });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /user/:id
    getById: async (req, res) => {
        try {
            const user = await userService.GetUserById(req.params.id);
            if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
            res.status(200).json({ status: 'success', data: user });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // PUT /user/:id
    update: async (req, res) => {
        try {
            const { error } = updateUserSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });
            
            const updatedUser = await userService.UpdateUser(req.params.id, req.body);
            if (!updatedUser) return res.status(404).json({ status: 'error', message: 'User not found' });
            res.status(200).json({ status: 'success', data: updatedUser });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // DELETE /user/:id
    delete: async (req, res) => {
        try {
            const result = await userService.DeleteUser(req.params.id);
            if (!result) return res.status(404).json({ status: 'error', message: 'User not found' });
            res.status(200).json({ status: 'success', message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};
