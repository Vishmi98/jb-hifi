import mongoose, { Schema, Document } from "mongoose";


export interface TagLine extends Document {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const tagLineSchema = new Schema<TagLine>(
    {
        id: { type: Number, required: true, unique: true },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const TagLineModel =
    mongoose.models.TagLine || mongoose.model("TagLine", tagLineSchema);

export default TagLineModel;