import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 전체 질문 랜덤 반환(각 태그별 비율 맞춰서)
  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  // 특정 질문 반환
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.questionsService.findById(id);
  }
}
