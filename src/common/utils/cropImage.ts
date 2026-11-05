export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an HTMLImageElement from a given URL.
 * Uses crossOrigin='anonymous' to prevent canvas tainting (CORS issues).
 *
 * @param url - The source URL or base64 string of the image.
 * @returns A Promise resolving to the fully loaded HTMLImageElement.
 */
export const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => {
      console.error('[CropImage] Failed to load image from URL:', error);
      reject(new Error('Failed to load image for cropping'));
    });

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
};

/**
 * Crops an image based on the provided pixel coordinates and returns a File object.
 *
 * @param imageSrc - The source URL or base64 string of the image.
 * @param pixelCrop - The coordinates and dimensions of the crop box.
 * @param fileName - The output filename (default: 'profile-cropped.jpeg').
 * @returns A Promise resolving to the cropped File, or null if the process fails.
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName: string = 'profile-cropped.jpeg'
): Promise<File | null> => {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('[CropImage] Failed to get 2D canvas context');
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          console.error('[CropImage] Canvas output is empty; could not create Blob');
          resolve(null);
          return;
        }

        const file = new File([blob], fileName, { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  } catch (error: unknown) {
    console.error('[CropImage] Unexpected error during image cropping:', error);
    return null;
  }
};
