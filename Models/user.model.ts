import mongoose, { Schema } from "mongoose";

export class User {
    static schema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        refreshToken: {
            type: String,
            required: false
        }
    })

    static model = mongoose.model('User', User.schema)

    static async addUser(email: string, password: string) {
        const user = new User.model({ email, password })
        await user.save()
        return user._id
    }

    static async getUserByEmail(email: string) {
        const user = await User.model.findOne({ email })
        return user
    }

    static async getUserById(id: string) {
        const user = await User.model.findById(id)
        return user
    }

    static async deleteUserById(id: string) {
        const user = await User.model.findByIdAndDelete(id)
        return user
    }
}