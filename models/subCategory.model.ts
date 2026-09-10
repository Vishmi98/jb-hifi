import mongoose, { Schema, Document } from "mongoose";


export interface ISubCategory extends Document {
    id: number;
    categoryId: number;
    mainCategoryId: number;
    name: string;
    description: string;
    subSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const subCategorySchema = new Schema<ISubCategory>(
    {
        id: { type: Number, required: true, unique: true },
        categoryId: { type: Number, required: true },
        mainCategoryId: { type: Number, required: true },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        subSlug: {
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

subCategorySchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

subCategorySchema.virtual("mainCategoryInfo", {
    ref: "MainCategory",
    localField: "mainCategoryId",
    foreignField: "id",
    justOne: true,
});

subCategorySchema.set("toObject", { virtuals: true });
subCategorySchema.set("toJSON", { virtuals: true });

const SubCategoryModel =
    mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export default SubCategoryModel;