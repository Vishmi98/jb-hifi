import mongoose, { Schema, Document } from "mongoose";

export interface ICollection {
    imagePath?: string;
    imagePathId?: string;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    compareLink?: string;
}

export interface IBrand extends Document {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    logoId?: string;
    bannerImages?: string[];
    bannerImageIds?: string[];
    shortDescription?: string;
    videoLink?: string;
    collections?: ICollection[];
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const collectionSchema = new Schema(
    {
        imagePath: String,
        imagePathId: String,
        categoryId: Number,
        mainCategoryId: Number,
        subCategoryId: Number,
        compareLink: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// 2. Attach virtual populates to collectionSchema
collectionSchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

collectionSchema.virtual("mainCategoryInfo", {
    ref: "MainCategory",
    localField: "mainCategoryId",
    foreignField: "id",
    justOne: true,
});

collectionSchema.virtual("subCategoryInfo", {
    ref: "SubCategory",
    localField: "subCategoryId",
    foreignField: "id",
    justOne: true,
});

const brandSchema = new Schema<IBrand>(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        logo: String,
        logoId: String,
        bannerImages: { type: [String], default: [] },
        bannerImageIds: { type: [String], default: [] },
        shortDescription: String,
        videoLink: String,
        collections: [collectionSchema],
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

brandSchema.set("toObject", { virtuals: true });
brandSchema.set("toJSON", { virtuals: true });

const BrandModel =
    mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default BrandModel;