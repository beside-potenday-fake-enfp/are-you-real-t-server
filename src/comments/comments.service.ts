import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // 댓글 목록 반환
  async getCommentsByQuestionId(questionId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { questionId: parseInt(questionId) },
      orderBy: { createdAt: 'desc' },
    });

    return {
      count: comments.length,
      commentList: comments.map((comment) => ({
        id: comment.id,
        testerId: comment.testerId,
        mbti: comment.mbti,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    };
  }

  // 댓글 작성
  async createComment(commentData: {
    testerId: string;
    questionId: number;
    mbti: string;
    content: string;
  }) {
    const { testerId, questionId, mbti, content } = commentData;

    let tester = await this.prisma.tester.findUnique({
      where: { id: testerId },
    });

    if (!tester) {
      tester = await this.prisma.tester.create({
        data: {
          id: testerId,
          mbti,
        },
      });
    }

    const newComment = await this.prisma.comment.create({
      data: {
        testerId,
        questionId,
        mbti,
        content,
      },
    });

    return {
      message: '댓글이 작성되었습니다',
      data: newComment,
    };
  }
}
