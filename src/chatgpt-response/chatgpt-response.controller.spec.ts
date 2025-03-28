import { Test, TestingModule } from '@nestjs/testing';
import { ChatgptResponseController } from './chatgpt-response.controller';

describe('ChatgptResponseController', () => {
  let controller: ChatgptResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatgptResponseController],
    }).compile();

    controller = module.get<ChatgptResponseController>(ChatgptResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
