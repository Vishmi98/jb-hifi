import mongoose, { Schema, Document } from "mongoose";

export interface IItem {
    id: number;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    leafCategoryId?: number;
    brandId?: number;
    productId?: number;
    imagePath?: string;
    imageId?: string;
}

export interface IBanner extends Document {
    id: number;
    bannerType: string; //[category, main category, sub category, leaf category, brand, home, product]
    items: IItem[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Sub-schema for the embedded item array
const itemSchema = new Schema<IItem>(
    {
        id: { type: Number, required: true },
        categoryId: { type: Number },
        mainCategoryId: { type: Number },
        subCategoryId: { type: Number },
        leafCategoryId: { type: Number },
        brandId: { type: Number },
        productId: { type: Number },
        imagePath: { type: String },
        imageId: { type: String },
    },
    { _id: false } // Prevents Mongoose from auto-generating an _id for sub-documents
);

itemSchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

itemSchema.virtual("mainCategoryInfo", {
    ref: "MainCategory",
    localField: "mainCategoryId",
    foreignField: "id",
    justOne: true,
});

itemSchema.virtual("subCategoryInfo", {
    ref: "SubCategory",
    localField: "subCategoryId",
    foreignField: "id",
    justOne: true,
});

itemSchema.virtual("leafCategoryInfo", {
    ref: "LeafCategory",
    localField: "leafCategoryId",
    foreignField: "id",
    justOne: true,
});

itemSchema.virtual("brandInfo", {
    ref: "Brand",
    localField: "brandId",
    foreignField: "id",
    justOne: true,
});

itemSchema.virtual("productInfo", {
    ref: "Product",
    localField: "productId",
    foreignField: "id",
    justOne: true,
});

const bannerSchema = new Schema<IBanner>(
    {
        id: { type: Number, required: true, unique: true },
        bannerType: {
            type: String,
            required: true,
            enum: [
                "category",
                "main category",
                "sub category",
                "leaf category",
                "brand",
                "home",
                "product",
            ],
        },
        items: { type: [itemSchema], default: [] },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

bannerSchema.set("toObject", { virtuals: true });
bannerSchema.set("toJSON", { virtuals: true });

const BannerModel =
    mongoose.models.Banner || mongoose.model<IBanner>("Banner", bannerSchema);

export default BannerModel;