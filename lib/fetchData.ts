import { getBrandBySlug } from "@/modules/brand/brand.service";
import { BrandDataType } from "@/modules/brand/brand.types";
import { CategoryDataType } from "@/modules/category/category.types";
import { getCategoryBySlug } from "@/modules/homePage/homePage.service";
import { getMainCategoryBySlug } from "@/modules/mainCategory/mainCategory.service";
import { MainCategoryDataType } from "@/modules/mainCategory/mainCategory.types";
import { getSubCategoryBySlug } from "@/modules/subCategory/subCategory.service";
import { SubCategoryDataType } from "@/modules/subCategory/subCategory.types";


export async function fetchCategory(slug: string): Promise<CategoryDataType | null> {
    try {
        const res = await getCategoryBySlug({ slug });
        if (!res.success || !res.category) {
            return null;
        }
        return res.category;
    } catch (error) {
        console.error("Error fetching category data:", error);
        return null;
    }
}

export async function fetchMainCategory(mainSlug: string): Promise<MainCategoryDataType | null> {
    try {
        const res = await getMainCategoryBySlug({ mainSlug });
        if (!res.success || !res.mainCategory) {
            return null;
        }
        return res.mainCategory;
    } catch (error) {
        console.error("Error fetching main category data:", error);
        return null;
    }
}

export async function fetchSubCategory(subSlug: string): Promise<SubCategoryDataType | null> {
    try {
        const res = await getSubCategoryBySlug({ subSlug });
        if (!res.success || !res.subCategory) {
            return null;
        }
        return res.subCategory;
    } catch (error) {
        console.error("Error fetching sub category data:", error);
        return null;
    }
}

export async function fetchBrand(slug: string): Promise<BrandDataType | null> {
    try {
        const res = await getBrandBySlug({ slug });
        if (!res.success || !res.brand) {
            return null;
        }
        return res.brand;
    } catch (error) {
        console.error("Error fetching brand data:", error);
        return null;
    }
}
