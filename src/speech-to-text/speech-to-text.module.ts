import { Module } from '@nestjs/common';
import { SpeechToTextService } from './speech-to-text.service';
import { SpeechToTextController } from './speech-to-text.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SpeechToTextService],
  controllers: [SpeechToTextController]
})
export class SpeechToTextModule {}
