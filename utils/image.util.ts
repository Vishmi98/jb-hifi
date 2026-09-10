export const getCroppedImg = (
    file: File,
    croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
    },
    width: number,
    height: number
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Canvas not supported"));
                    return;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    width,
                    height
                );

                // Preserve PNG if original is PNG.
                const outputType =
                    file.type === "image/png"
                        ? "image/png"
                        : "image/jpeg";

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to crop image"));
                            return;
                        }

                        const extension =
                            outputType === "image/png"
                                ? "png"
                                : "jpg";

                        const fileName = file.name.replace(
                            /\.[^/.]+$/,
                            `.${extension}`
                        );

                        const croppedFile = new File(
                            [blob],
                            fileName,
                            {
                                type: outputType,
                            }
                        );

                        resolve(croppedFile);
                    },
                    outputType,
                    outputType === "image/jpeg" ? 0.95 : undefined
                );
            };

            image.onerror = () => {
                reject(new Error("Failed to load image"));
            };

            image.src = reader.result as string;
        };

        reader.onerror = () => {
            reject(new Error("Failed to read image"));
        };

        reader.readAsDataURL(file);
    });
};