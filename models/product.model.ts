import mongoose, { Schema, Document, Model } from "mongoose";


export interface IProductSpecification {
    name: string;
    value: string;
}

export interface IProductVariant {
    id: number;
    productModel: string;
    sku: string;
    price: number;
    originalPrice: number;
    additionalPrice: number;
    stockCount: number;
    color: string;
    colorHexCode: string;
    specifications: IProductSpecification[];
    imagePath: string;
    imagePathId: string;
}

export interface IFeature {
    title: string;
    description: string;
}

export interface IDescription {
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    features?: IFeature[];
    videoUrl?: string;
}

export interface IProduct extends Document {
    id: number;
    title: string;
    slug: string;
    description: IDescription;
    keyFeatures: string[];

    // Categorization & Brand
    brandId: number;
    storeId: number;
    categoryId: number;
    mainCategoryId: number;
    subCategoryId: number;
    leafCategoryId: number;
    ratings: number;
    reviews: string[];

    // Pricing & Inventory
    sellType: number;
    tagLineId: number;
    paymentMethods: number[];

    // Media
    mainImage: string;
    mainImageId: string;
    images: string[];
    imageIds: string[];

    // Variants
    variants: IProductVariant[];

    // Features & Meta
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];

    createdAt: Date;
    updatedAt: Date;
}

// --- Sub-Schemas ---

const specificationSchema = new Schema<IProductSpecification>(
    {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const variantSchema = new Schema<IProductVariant>(
    {
        id: { type: Number, required: true, unique: true, index: true },
        productModel: { type: String, trim: true, default: "" },
        sku: { type: String, trim: true, default: "" },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, default: 0, min: 0 },
        additionalPrice: { type: Number, default: 0, min: 0 },
        stockCount: { type: Number, default: 0, min: 0 },
        color: { type: String, trim: true, default: "" },
        colorHexCode: { type: String, trim: true, default: "" },
        specifications: { type: [specificationSchema], default: [] },
        imagePath: { type: String, default: "" },
        imagePathId: { type: String, default: "" },
    },
    { _id: false }
);

const featureSchema = new Schema<IFeature>(
    {
        title: { type: String, trim: true, default: "" },
        description: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const descriptionSchema = new Schema<IDescription>(
    {
        paragraph1: { type: String, trim: true, default: "" },
        paragraph2: { type: String, trim: true, default: "" },
        paragraph3: { type: String, trim: true, default: "" },
        features: { type: [featureSchema], default: [] },
        videoUrl: { type: String, default: "" },
    },
    { _id: false }
);

// --- Main Schema ---

const productSchema = new Schema<IProduct>(
    {
        id: { type: Number, required: true, unique: true, index: true },
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true, index: true },
        description: { type: descriptionSchema, default: () => ({}) },
        keyFeatures: { type: [String], default: [] },

        // Category & Brand Foreign Keys
        brandId: { type: Number, index: true },
        storeId: { type: Number, index: true },
        categoryId: { type: Number, index: true },
        mainCategoryId: { type: Number, index: true },
        subCategoryId: { type: Number, index: true },
        leafCategoryId: { type: Number, index: true },
        ratings: { type: Number, default: 0, min: 0, max: 5 },
        reviews: { type: [String], default: [] },

        // Pricing & Inventory
        sellType: { type: Number, default: 0, index: true },
        tagLineId: { type: Number, default: 0 },
        paymentMethods: { type: [Number], default: [] },

        // Media
        mainImage: { type: String, required: true },
        mainImageId: { type: String, default: "" },
        images: { type: [String], default: [] },
        imageIds: { type: [String], default: [] },

        // Variants
        variants: { type: [variantSchema], default: [] },

        // Meta Flags
        isFeatured: { type: Boolean, default: false, index: true },
        isActive: { type: Boolean, default: true, index: true },
        tags: { type: [String], default: [] },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// --- Compound Indexes ---
productSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });

// --- Virtual Populates ---

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

productSchema.virtual("leafCategoryInfo", {
    ref: "LeafCategory",
    localField: "leafCategoryId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("sellTypeInfo", {
    ref: "SellType",
    localField: "sellType",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("tagLineInfo", {
    ref: "TagLine",
    localField: "tagLineId",
    foreignField: "id",
    justOne: true,
});

productSchema.virtual("paymentMethodsInfo", {
    ref: "PaymentMethod",
    localField: "paymentMethods",
    foreignField: "id",
    justOne: false,
});

const ProductModel: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;