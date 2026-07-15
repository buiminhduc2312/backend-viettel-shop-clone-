import mongoose, { Schema } from 'mongoose';

const blacklistSchema = new Schema(
    {
        token: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

blacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 });

export const BlacklistModel = mongoose.model('Blacklist', blacklistSchema);
