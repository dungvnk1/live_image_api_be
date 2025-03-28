import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DidService } from './did.service';

@Controller('did')  // URL gốc: /did
export class DidController {
  constructor(private readonly didService: DidService) {}

  // Endpoint để bắt đầu tạo video
  @Post('create-talk')
  async createTalk(
    @Body('imageUrl') imageUrl: string,
    @Body('text') text: string,
    @Body('voiceId') voiceId?: string
  ) {
    // Gọi service để tạo talk
    const talkResponse = await this.didService.createTalkFromImage(imageUrl, text, voiceId);
    // Trả về thông tin talk ban đầu (bao gồm talk ID và status "created")
    return { talkId: talkResponse.id, status: talkResponse.status };
  }

  // Endpoint để kiểm tra trạng thái video theo talkId
  @Get('talk-status')
  async getTalkStatus(@Query('id') talkId: string) {
    const statusResponse = await this.didService.getTalkStatus(talkId);
    return statusResponse; // Bao gồm cả status và (nếu xong) result_url
  }
}
