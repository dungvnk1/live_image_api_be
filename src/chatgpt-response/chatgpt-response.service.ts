import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatgptResponseService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in the environment variables');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async processTranscribedText(transcribedText: string): Promise<string> {
    try {
      console.log('Processing transcribed text with ChatGPT:', transcribedText);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: transcribedText }
        ],
        max_tokens: 500,
      });

      console.log('ChatGPT response:', response.choices[0].message.content);
      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error processing with ChatGPT:', error);
      throw new Error('Failed to process text with ChatGPT');
    }
  }
}
