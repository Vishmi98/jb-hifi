import mongoose, { Schema, Document } from "mongoose";

export interface IShipping {
    shortDescription?: string;
    faq: {
        question?: string;
        answer?: string;
    }[]
}

export interface IStore extends Document {
    id: number;
    name: string;
    description: string;
    website: string;
    slug: string;
    abn: string;
    noOfEmployees: number;
    annualRevenue: string;
    categories: number[];
    logoPath?: string;
    logoId?: string;
    shipping: IShipping;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const shippingSchema = new Schema<IShipping>(
    {
        shortDescription: { type: String, default: "" },
        faq: [{
            question: { type: String, default: "" },
            answer: { type: String, default: "" },
        }]
    },
    { _id: false }
);

const storeSchema = new Schema<IStore>(
    {
        id: { type: Number, required: true, unique: true },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        abn: {
            type: String,
            default: "",
        },
        noOfEmployees: {
            type: Number,
            default: 0,
        },
        annualRevenue: {
            type: String,
            default: "",
        },
        categories: {
            type: [Number],
            default: [],
        },
        logoPath: { type: String },
        logoId: { type: String },
        shipping: {
            type: shippingSchema,
            default: {},
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

storeSchema.virtual("categoryInfo", {
    ref: "Category",
    localField: "categories",
    foreignField: "id",
    justOne: false,
});

storeSchema.set("toObject", { virtuals: true });
storeSchema.set("toJSON", { virtuals: true });

const StoreModel =
    mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);

export default StoreModel;