import { Module } from '@nestjs/common';
import { ChatgptResponseController } from './chatgpt-response.controller';
import { ChatgptResponseService } from './chatgpt-response.service';
import { DidModule } from '../did/did.module';

@Module({
    controllers: [ChatgptResponseController],
    providers: [ChatgptResponseService],
    imports: [DidModule],
  })
export class ChatgptResponseModule {}
