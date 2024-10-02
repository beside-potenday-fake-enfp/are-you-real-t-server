import { Controller, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 특정 질문지에 해당하는 댓글 반환
  @Get('')
  findByQuestionId(@Query('questionId') questionId: string) {
    return this.commentsService.findByQuestionId(questionId);
  }
}
