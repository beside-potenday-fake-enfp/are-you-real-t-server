import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /comments - 질문지에 대한 댓글 리스트 반환
  @Get('')
  getCommentsByQuestionId(@Query('questionId') questionId: string) {
    return this.commentsService.getCommentsByQuestionId(questionId);
  }

  // POST /comments - 댓글 작성
  @Post('')
  createComment(
    @Body()
    commentData: {
      testerId: string;
      questionId: number;
      mbti: string;
      content: string;
    },
  ) {
    return this.commentsService.createComment(commentData);
  }
}
