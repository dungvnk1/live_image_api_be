import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpeechToTextModule } from './speech-to-text/speech-to-text.module';
import { ConfigModule } from '@nestjs/config';
import { ChatgptResponseModule } from './chatgpt-response/chatgpt-response.module';
import { DidModule } from './did/did.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpeechToTextModule,
    ChatgptResponseModule,
    DidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
