import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // 12개 질문지 랜덤 반환 (각 타입별로 3개씩)
  async get12RandomQuestions() {
    const types = ['energy', 'information', 'decision', 'lifeStyle'];
    const questions = [];

    for (const type of types) {
      const typeQuestions = await this.prisma.question.findMany({
        where: { type },
        include: {
          answers: true,
        },
      });

      const shuffledQuestions = typeQuestions.sort(() => 0.5 - Math.random());
      questions.push(...shuffledQuestions.slice(0, 3));
    }

    const entireShuffledQuestions = questions.sort(() => 0.5 - Math.random());

    return entireShuffledQuestions.map((question) => ({
      id: question.id,
      content: question.content,
      imageUrl: question.imageUrl,
      answerList: question.answers.map((answer) => ({
        id: answer.id,
        content: answer.content,
      })),
    }));
  }

  // 전체 질문지 반환
  async getAllQuestions() {
    const questions = await this.prisma.question.findMany({
      include: {
        answers: true,
        votes: true,
        comments: true,
      },
    });

    return questions.map((question) => ({
      id: question.id,
      type: question.type,
      content: question.content,
      answerList: question.answers.map((answer) => ({
        id: answer.id,
        content: answer.content,
      })),
      voteCount: question.votes.length,
      commentCount: question.comments.length,
    }));
  }

  // 질문지 상세 반환
  async getQuestionById(id: string, testerId: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        answers: true,
        votes: true,
      },
    });

    const userVote = await this.prisma.vote.findFirst({
      where: {
        testerId: testerId,
        questionId: parseInt(id),
      },
    });

    return {
      id: question.id,
      type: question.type,
      content: question.content,
      imageUrl: question.imageUrl,
      answerList: question.answers.map((answer) => ({
        id: answer.id,
        content: answer.content,
        tag: answer.tag,
        selectCount: answer.selectCount || 0,
      })),
      voteCount: question.votes.length,
      votedAnswerId: userVote ? userVote.answerId : null,
    };
  }

  // 답변 투표
  async vote(voteData: {
    testerId: string;
    questionId: number;
    answerId: number;
    mbti: string;
  }) {
    const { testerId, questionId, answerId, mbti } = voteData;

    // tester 데이터 생성
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

    const newVote = await this.prisma.vote.create({
      data: {
        testerId,
        questionId,
        answerId,
      },
    });

    // 투표한 답변의 selectCount를 증가
    await this.prisma.answer.update({
      where: { id: answerId },
      data: {
        selectCount: { increment: 1 },
      },
    });

    return {
      message: '투표가 완료되었습니다',
      data: newVote,
    };
  }
}
