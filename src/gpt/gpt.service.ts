import { Injectable } from '@nestjs/common';
import {
  audioToTextUseCase,
  getGenerateImageUseCase,
  imageGenerationUseCase,
  imageToTextUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioGetterUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageToTextDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  ProsConsDiscusserStreamDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Solo va a llamar casos de uso
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser(prosConsDicusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, {
      prompt: prosConsDicusserDto.prompt,
    });
  }

  async prosConsDicusserStream(
    prosConsDicusserStreamDto: ProsConsDiscusserStreamDto,
  ) {
    return await prosConsDicusserStreamUseCase(this.openai, {
      prompt: prosConsDicusserStreamDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudioDto.prompt,
      voice: textToAudioDto.voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    return await textToAudioGetterUseCase(fileId);
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto?: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt: audioToTextDto.prompt,
    });
  }
  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  async getGeneratedImage(filename: string) {
    return await getGenerateImageUseCase(filename);
  }

  async imageVariation(imageVariation: ImageVariationDto) {
    return imageVariationUseCase(this.openai, {
      baseImage: imageVariation.baseImage,
    });
  }

  async imageToText(file: Express.Multer.File, prompt: string) {
    return await imageToTextUseCase(this.openai, {
      imageFile: file,
      prompt: prompt,
    });
  }
}
