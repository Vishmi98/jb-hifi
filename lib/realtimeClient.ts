"use client";

import Pusher from "pusher-js";

let pusher: Pusher | null = null;

export const subscribeToDataChanges = (
    resource: "stores" | "categories" | "mainCategories" | "subCategories" | "leafCategories" | "brands" | "brandBanners" | "brandCollections" | "banners" | "bannerItems" | "paymentMethods" | "sellTypes" | "tagLines",
    onChange: () => void,
) => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) return () => undefined;

    pusher ??= new Pusher(key, { cluster });
    const channel = pusher.subscribe("catalog");
    const handler = (event: { resource?: string }) => {
        if (event.resource === resource) onChange();
    };

    channel.bind("data-changed", handler);

    return () => {
        channel.unbind("data-changed", handler);
    };
};