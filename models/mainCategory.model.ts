import mongoose, { Schema, Document } from "mongoose";


export interface IMainCategory extends Document {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    mainSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const mainCategorySchema = new Schema<IMainCategory>(
    {
        id: { type: Number, required: true, unique: true },
        categoryId: { type: Number, required: true },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        mainSlug: {
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

mainCategorySchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

mainCategorySchema.set("toObject", { virtuals: true });
mainCategorySchema.set("toJSON", { virtuals: true });

const MainCategoryModel =
    mongoose.models.MainCategory || mongoose.model("MainCategory", mainCategorySchema);

export default MainCategoryModel;