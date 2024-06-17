import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import { NotFoundException } from '@nestjs/common';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response.data[0].url);

    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: url,
      localPath: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }
  // originalImage=http://localhost:3000/gpt/image-generation/awwewe.png
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  // maskIamge=Base64;43443434334343443ffsfdsdsfsdf
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const localImagePath = await downloadImageAsPng(response.data[0].url);
  const fileName = path.basename(localImagePath);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    localPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};

export const getGenerateImageUseCase = async (filename: string) => {
  const filePath = path.resolve('./', `./generated/images/${filename}`);
  if (fs.existsSync(filePath)) {
    return filePath;
  } else {
    throw new NotFoundException('File not found');
  }
};
