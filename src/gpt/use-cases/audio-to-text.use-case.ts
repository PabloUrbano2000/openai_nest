import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt,
    // https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
    language: 'es',
    response_format: 'verbose_json', // vtt, srt
  });

  return response;
};
