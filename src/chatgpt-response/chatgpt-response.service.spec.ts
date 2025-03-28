import { Test, TestingModule } from '@nestjs/testing';
import { ChatgptResponseService } from './chatgpt-response.service';

describe('ChatgptResponseService', () => {
  let service: ChatgptResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatgptResponseService],
    }).compile();

    service = module.get<ChatgptResponseService>(ChatgptResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
