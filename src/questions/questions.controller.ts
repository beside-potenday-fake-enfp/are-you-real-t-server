import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // GET /questions/tmp - 12개 질문 리스트 반환
  @Get('/tmp')
  get12RandomQuestions() {
    return this.questionsService.get12RandomQuestions();
  }

  // GET /questions - 전체 질문 리스트 반환
  @Get()
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  // 현재: 답변(Answer) 도메인 별도로 없음. 따라서, 투표 또한 답변 하위로 못 내림.

  // POST /questions/vote - 답변 투표하기
  @Post('/vote')
  vote(
    @Body()
    voteData: {
      testerId: string;
      questionId: number;
      answerId: number;
      mbti: string;
    },
  ) {
    return this.questionsService.vote(voteData);
  }

  // GET /questions/:id - 질문 상세 반환
  @Get('/:id')
  getQuestionById(
    @Param('id') id: string,
    @Query('testerId') testerId: string,
  ) {
    return this.questionsService.getQuestionById(id, testerId);
  }
}
