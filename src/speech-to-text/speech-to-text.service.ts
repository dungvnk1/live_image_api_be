import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsClient } from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpeechToTextService {
  private elevenLabsClient: ElevenLabsClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY');
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not defined in the environment variables');
    }
    this.elevenLabsClient = new ElevenLabsClient({ apiKey });
  }

  async transcribeAudio(filePath: string): Promise<string> {
    const absolutePath = path.resolve(filePath);
    console.log('Absolute file path:', absolutePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const fileBuffer = fs.readFileSync(absolutePath); // Đọc file thành buffer
    const audioBlob = new Blob([fileBuffer], { type: 'audio/webm' }); // Tạo Blob từ buffer

    try {
      console.log('Uploading file to ElevenLabs...');
      const transcription = await this.elevenLabsClient.speechToText.convert({
        file: audioBlob,
        model_id: 'scribe_v1', // Model được sử dụng
        tag_audio_events: true, // Gắn thẻ các sự kiện âm thanh
        language_code: 'vie', // Ngôn ngữ của file âm thanh
        diarize: true, // Ghi chú ai đang nói
      });

      console.log('Transcription result:', transcription.text);
      return transcription.text; // Trả về kết quả transcription
    } catch (error) {
      console.error('Error during transcription:', error);
      throw new Error('Failed to transcribe audio using ElevenLabs.');
    }
  }

  async textToAudio(text: string): Promise<Buffer> {
    try {
      console.log('Converting text to audio...');
      const audioStream = await this.elevenLabsClient.textToSpeech.convertAsStream('JBFqnCBsd6RMkjVDRZzb', {
        model_id: 'eleven_multilingual_v2',
        text,
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0,
          similarity_boost: 1.0,
          use_speaker_boost: true,
          speed: 1.0,
        },
      });
  
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks);
      console.log('Audio conversion completed.');
      return content;
    } catch (error) {
      console.error('Error during text-to-audio conversion:', error);
      throw new Error('Failed to convert text to audio using ElevenLabs.');
    }
  }
}