import ImageKit from "imagekit";

export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export class ImageKitService {
  static async uploadImage(file: Buffer, fileName: string, folder: string) {
    return await imageKit.upload({
      file,
      fileName,
      folder: `/${folder}`,
    });
  };

  static async deleteImage(fileId: string) {
    return await imageKit.deleteFile(fileId);
  };
}
