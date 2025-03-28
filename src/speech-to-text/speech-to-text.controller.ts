import { Controller, Post, UseInterceptors, UploadedFile, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechToTextService } from './speech-to-text.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('speech-to-text')
export class SpeechToTextController {
  constructor(private readonly openAiService: SpeechToTextService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // thư mục tạm lưu file
      filename: (req, file, callback) => {
        // Đặt tên file duy nhất (vd: date now + ext)
        const uniqueSuffix = Date.now() + extname(file.originalname);
        callback(null, file.fieldname + '-' + uniqueSuffix);
      }
    }),
    limits: { fileSize: 25 * 1024 * 1024 }, // giới hạn 25MB
  }))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    try {
      console.log('File:', file);
      const text = await this.openAiService.transcribeAudio(file.path);
      console.log('Transcription:', text);
      // Xóa file tạm nếu cần thiết (fs.unlink) để tiết kiệm dung lượng
      return { text };
    } catch (err) {
      console.error('Lỗi khi gọi OpenAI API:', err);
      return { error: 'Transcription failed' };
    }
  }

  @Post('text-to-audio')
  async convertTextToAudio(@Body('text') text: string, @Res() res: Response) {
    console.log('Received text for conversion:', text);
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('Received text for conversion:', text);
      const audioBuffer = await this.openAiService.textToAudio(text);

      // Set headers for audio file response
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="output.mp3"',
      });

      res.send(audioBuffer);
    } catch (error) {
      console.error('Error during text-to-audio conversion:', error);
      throw new HttpException(
        error.message || 'Failed to convert text to audio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}