/* eslint-disable @typescript-eslint/no-explicit-any */
// --- Helper Functions for FormData Parsing ---
export const parseBool = (value: FormDataEntryValue | null, defaultValue: boolean): boolean => {
    if (value === null) return defaultValue;
    return value === "true" || value === "1";
};

export const parseNumber = (value: FormDataEntryValue | null, defaultValue: number): number => {
    if (value === null || value === "") return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

export const parseJSON = (value: FormDataEntryValue | null, defaultValue: any) => {
    if (!value || typeof value !== "string") return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
};