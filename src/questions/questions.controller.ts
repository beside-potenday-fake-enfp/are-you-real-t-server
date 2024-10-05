import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 1. GET /questions/tmp - 12개 질문 리스트 반환
  @Get('/tmp')
  get12RandomQuestions() {
    return this.questionsService.get12RandomQuestions();
  }

  // 2. GET /questions - 전체 질문 리스트 반환
  @Get()
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  // 4. GET /questions/comment - 질문지에 대한 댓글 리스트 반환
  @Get('/comment')
  getCommentsByQuestionId(@Query('questionId') questionId: string) {
    return this.questionsService.getCommentsByQuestionId(questionId);
  }

  // 5. POST /questions/comment - 댓글 작성
  @Post('/comment')
  createComment(
    @Body()
    commentData: {
      testerId: string;
      questionId: number;
      mbti: string;
      content: string;
    },
  ) {
    return this.questionsService.createComment(commentData);
  }

  // 6. POST /questions/vote - 답변 투표하기
  @Post('/vote')
  vote(
    @Body()
    voteData: {
      testerId: string;
      questionId: number;
      answerId: number;
    },
  ) {
    return this.questionsService.vote(voteData);
  }

  // 7. GET /questions/result/:id - 결과지 상세 반환
  @Get('/result/:id')
  getTestResultById(@Param('id') id: string) {
    return this.questionsService.getTestResultById(id);
  }

  // 8. POST /questions/result - 결과지 생성(결과지 id 반환)
  @Post('/result')
  createResult(
    @Body() body: { answerId: number[]; testerId: string; prevMbti: string },
  ) {
    return this.questionsService.createResult(body);
  }

  // 3. GET /questions/:id - 질문 상세 반환
  @Get('/:id')
  getQuestionById(
    @Param('id') id: string,
    @Query('testerId') testerId: string,
  ) {
    return this.questionsService.getQuestionById(id, testerId);
  }
}
