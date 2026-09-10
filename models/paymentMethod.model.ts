import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentRequirement {
    name: string;
    description: string;
}

export interface IPaymentMethod extends Document {
    id: number;
    name: string; 
    slug: string; 
    logo?: string;
    logoId?: string;

    // Payment Limits & Terms
    minPurchaseAmount: number;
    maxPurchaseAmount: number;
    installmentCount: number; // e.g., 4 payments
    repaymentInterval: string; // e.g., "Fortnightly", "Weekly", "Monthly"

    // Content & Help Info
    shortDescription?: string;
    howItWorks: string[]; // Key steps on how to use the payment option
    requirements: IPaymentRequirement[]; // e.g., "AU resident", "18+ years old", "Valid Debit/Credit Card"
    termsAndConditionsUrl?: string;

    // System Flags
    isActive: boolean;
    displayOrder: number;

    createdAt: Date;
    updatedAt: Date;
}

const requirementSchema = new Schema<IPaymentRequirement>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

const paymentMethodSchema = new Schema<IPaymentMethod>(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true, index: true },
        logo: String,
        logoId: String,

        // Limits & Terms
        minPurchaseAmount: { type: Number, default: 0 },
        maxPurchaseAmount: { type: Number, default: 0 },
        installmentCount: { type: Number, required: true, default: 4 },
        repaymentInterval: { type: String, required: true, default: "Fortnightly" },

        // Descriptions & Help
        shortDescription: String,
        howItWorks: { type: [String], default: [] },
        requirements: [requirementSchema],
        termsAndConditionsUrl: String,

        // Config
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const PaymentMethodModel: Model<IPaymentMethod> =
    mongoose.models.PaymentMethod ||
    mongoose.model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);

export default PaymentMethodModel;