import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DidService {
  private readonly apiUrl = 'https://api.d-id.com';
  private readonly apiKey = process.env.DID_API_KEY;

  // Hàm tạo video từ ảnh và văn bản
  async createTalkFromImage(imageUrl: string, text: string, voiceId?: string) {
    // Cấu hình body cho request /talks
    const requestBody: any = {
      source_url: imageUrl,
      script: {
        type: 'text',
        input: text
      }
    };

    // Nếu chỉ định voiceId (ví dụ giọng Microsoft Azure), thêm vào provider
    if (voiceId) {
      requestBody.script.provider = { 
        type: 'microsoft', 
        voice_id: voiceId 
      };
    }

    try {
      const response = await axios.post(`${this.apiUrl}/talks`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.apiKey || '').toString('base64')}`
        }
      });
      return response.data; // Trả về dữ liệu phản hồi (bao gồm talk id và trạng thái ban đầu)
    } catch (error) {
      // Xử lý lỗi HTTP hoặc lỗi từ D-ID API
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data || 'Error calling D-ID API';
      throw new HttpException(message, status);
    }
  }

  // Hàm kiểm tra trạng thái video (dựa trên talk ID)
  async getTalkStatus(talkId: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/talks/${talkId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.apiKey || '').toString('base64')}`
        }
      });
      return response.data;
    } catch (error) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data || 'Error fetching talk status';
      throw new HttpException(message, status);
    }
  }
}
