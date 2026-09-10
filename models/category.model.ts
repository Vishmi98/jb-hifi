import mongoose, { Schema, Document } from "mongoose";


export interface ICategory extends Document {
    id: number;
    name: string;
    description: string;
    slug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const categorySchema = new Schema<ICategory>(
    {
        id: { type: Number, required: true, unique: true },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        imagePath: String,
        imageId: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const CategoryModel =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;