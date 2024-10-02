import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  private comments = [
    {
      id: '1',
      questionId: '1',
      mbti: 'ESTJ',
      nickname: '김재영',
      comment: '댓글내용내용내용',
      createdAt: '2024-10-02T10:30:00Z',
    },
    {
      id: '2',
      questionId: '1',
      mbti: 'ENFP',
      nickname: '오잉',
      comment: '댓글댓글내용내용',
      createdAt: '2024-10-02T10:45:00Z',
    },
    {
      id: '3',
      questionId: '2',
      mbti: 'ESTJ',
      nickname: '김재영',
      comment: '댓글댓글내용내용용',
      createdAt: '2024-10-02T10:45:00Z',
    },
  ];

  findByQuestionId(questionId: string) {
    return this.comments.filter((comment) => comment.questionId === questionId);
  }
}
