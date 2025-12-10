import type {ImageBase, ImageCreateDTO, ImageDocument, ImagePublicDTO} from '../dataTypes/ImageTypes.js';
import {ObjectId} from 'mongodb';
import {getCollection} from '../db.js';


function mapImagesToPublic(image: ImageDocument): ImagePublicDTO {
  return {
    path: image.path,
    fileName: image.fileName,
    imageId: image.imageId,
    type: image.type,
  }
}
export async function createImage(data: ImageCreateDTO): Promise<ImageBase> {
  try {
    const images = await getCollection<ImageDocument>('images');

    const newImage: ImageDocument = {
      ...data,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await images.insertOne(newImage);

    return mapImagesToPublic(newImage);
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getImage(id: string): Promise<ImagePublicDTO | null> {
  try {
    const images = await getCollection<ImageDocument>('images');

    const resultImage = await images.findOne({ imageId: id });

    if(!resultImage) {
      return null;
    }

    return mapImagesToPublic(resultImage);
  } catch (error) {
    console.log(error)
    throw error;
  }
}
