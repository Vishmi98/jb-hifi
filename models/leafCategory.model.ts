import mongoose, { Schema, Document } from "mongoose";


export interface ILeafCategory extends Document {
    id: number;
    categoryId: number;
    mainCategoryId: number;
    subCategoryId: number;
    name: string;
    description: string;
    leafSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const leafCategorySchema = new Schema<ILeafCategory>(
    {
        id: { type: Number, required: true, unique: true },
        categoryId: { type: Number, required: true },
        mainCategoryId: { type: Number, required: true },
        subCategoryId: { type: Number, required: true },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        leafSlug: {
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

leafCategorySchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

leafCategorySchema.virtual("mainCategoryInfo", {
    ref: "MainCategory",
    localField: "mainCategoryId",
    foreignField: "id",
    justOne: true,
});

leafCategorySchema.virtual("subCategoryInfo", {
    ref: "SubCategory",
    localField: "subCategoryId",
    foreignField: "id",
    justOne: true,
});

leafCategorySchema.set("toObject", { virtuals: true });
leafCategorySchema.set("toJSON", { virtuals: true });

const LeadCategoryModel =
    mongoose.models.LeafCategory || mongoose.model("LeafCategory", leafCategorySchema);

export default LeadCategoryModel;