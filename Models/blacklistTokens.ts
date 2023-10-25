import mongoose, { Schema, Types } from "mongoose";
import config from "../Config/config";


export class BlacklistTokens {
    static schema = new Schema({
        tokens: {
            type: [String],
            required: true
        }
    })

    static model = mongoose.model('BlacklistTokens', BlacklistTokens.schema)

    static async addToken(token: string) {
        await BlacklistTokens.model.findOneAndUpdate({ _id: config.app.blacklist.ID }, { $push: { tokens: token } }, { upsert: true })
    }

    static async isTokenBlacklisted(token: string) {
        const result = await BlacklistTokens.model.findOne({ _id: config.app.blacklist.ID, tokens: token })
        if (result) {
            return true
        }
        return false
    }

    static async deleteToken(token: string) {
        await BlacklistTokens.model.findOneAndUpdate({ _id: config.app.blacklist.ID }, { $pull: { tokens: token } })
    }

    static async deleteAllTokens() {
        await BlacklistTokens.model.findOneAndUpdate({ _id: config.app.blacklist.ID }, { $set: { tokens: [] } })
    }

    static async deleteAllTokensByUserId(userId: Types.ObjectId) {
        await BlacklistTokens.model.findOneAndUpdate({ _id: config.app.blacklist.ID }, { $pull: { tokens: { $regex: userId } } })
    }
}