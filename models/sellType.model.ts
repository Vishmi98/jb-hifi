import mongoose, { Schema, Document } from "mongoose";


export interface SellType extends Document {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const sellTypeSchema = new Schema<SellType>(
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

const SellTypeModel =
    mongoose.models.SellType || mongoose.model("SellType", sellTypeSchema);

export default SellTypeModel;