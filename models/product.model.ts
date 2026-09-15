import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductSpecification {
    name: string;
    value: string;
}

export interface IProductVariantOption {
    name: string; // e.g., "Color", "Storage", "Model"
    value: string; // e.g., "Cobalt Violet", "256GB"
}

export interface IProductVariant {
    model?: string;
    sku?: string;
    price?: number;
    originalPrice?: number;
    stockCount: number;
    attributes: IProductVariantOption[];
    color?: string;
    colorHexCode?: string;
    imagePath?: string;
    imagePathId?: string;
}

export interface IProduct extends Document {
    id: number;
    title: string;
    slug: string;
    description?: string;
    overview?: string[]; // Key feature bullet points

    // Categorization & Brand
    brandId?: number;
    storeId?: number;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    leafCategoryId?: number;
    ratings?: number;
    reviews?: string[];
    
    // Pricing & Inventory
    price: number;
    originalPrice?: number;
    sellType: number;
    tagLine: number;
    paymentMethods: number[];
    stockCount: number;
    sku?: string;

    // Media
    mainImage: string;
    mainImageId?: string;
    images: string[];
    imageIds?: string[];
    videoUrl?: string;

    // Specifications & Variants
    specifications: IProductSpecification[];
    variants: IProductVariant[];

    // Features & Meta
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];

    createdAt: Date;
    updatedAt: Date;
}

const specificationSchema = new Schema<IProductSpecification>(
    {
        name: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const variantOptionSchema = new Schema<IProductVariantOption>(
    {
        name: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const variantSchema = new Schema<IProductVariant>(
    {
        sku: { type: String, trim: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        stockCount: { type: Number, default: 0 },
        attributes: [variantOptionSchema],
        imagePath: { type: String },
        imagePathId: { type: String },
    },
    { timestamps: false }
);

const productSchema = new Schema<IProduct>(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true, index: true },
        description: { type: String },
        overview: { type: [String], default: [] },

        // Category & Brand Foreign Keys
        brandId: { type: Number, index: true },
        storeId: { type: Number, index: true },
        categoryId: { type: Number, index: true },
        mainCategoryId: { type: Number, index: true },
        subCategoryId: { type: Number, index: true },

        // Pricing & Inventory
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        sellType: { type: Number, default: 0 },
        tagLine: { type: Number, default: 0 },
        stockCount: { type: Number, default: 0 },
        sku: { type: String, unique: true, sparse: true, trim: true },

        // Media
        mainImage: { type: String, required: true },
        mainImageId: { type: String },
        images: { type: [String], default: [] },
        imageIds: { type: [String], default: [] },
        videoUrl: { type: String },

        // Specifications & Variants
        specifications: [specificationSchema],
        variants: [variantSchema],

        // Meta Flags
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        tags: { type: [String], default: [] },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual populate links to match Category models pattern
productSchema.virtual("brandInfo", {
    ref: "Brand",
    localField: "brandId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("storeInfo", {
    ref: "Store",
    localField: "storeId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("mainCategoryInfo", {
    ref: "MainCategory",
    localField: "mainCategoryId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("subCategoryInfo", {
    ref: "SubCategory",
    localField: "subCategoryId",
    foreignField: "id",
    justOne: true,
});

const ProductModel: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;