import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ChatgptResponseService } from './chatgpt-response.service';

@Controller('chatgpt-response')
export class ChatgptResponseController {
  constructor(private readonly chatgptResponseService: ChatgptResponseService) {}

  @Post()
  async getResponse(@Body('transcribedText') transcribedText: string) {
    if (!transcribedText) {
      throw new HttpException('Transcribed text is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.chatgptResponseService.processTranscribedText(transcribedText);
      return { response };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get response from ChatGPT',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
