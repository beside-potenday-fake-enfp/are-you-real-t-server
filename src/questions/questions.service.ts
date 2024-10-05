import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // 1. 12개 질문지 랜덤 반환 (각 타입별로 3개씩)
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

    questions.sort((a, b) => a.id - b.id);

    return questions.map((question) => ({
      id: question.id,
      content: question.content,
      imageUrl: question.imageUrl,
      answerList: question.answers.map((answer) => ({
        id: answer.id,
        content: answer.content,
      })),
    }));
  }

  // 2. 전체 질문지 반환
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

  // 3. 질문지 상세 반환
  // async getQuestionById(id: string, testerId: string) {
  //   const question = await this.prisma.question.findUnique({
  //     where: {
  //       id: parseInt(id),
  //     },
  //     include: {
  //       answers: true,
  //       votes: true,
  //     },
  //   });

  //   const userVote = await this.prisma.vote.findFirst({
  //     where: {
  //       testerId: testerId,
  //       questionId: parseInt(id),
  //     },
  //   });

  //   return {
  //     id: question.id,
  //     type: question.type,
  //     content: question.content,
  //     imageUrl: question.imageUrl,
  //     answerList: question.answers.map((answer) => ({
  //       id: answer.id,
  //       content: answer.content,
  //       tag: answer.tag,
  //       countMeta: answer.countMeta,
  //     })),
  //     voteCount: question.votes.length,
  //     votedAnswerId: userVote ? userVote.answerId : null,
  //   };
  // }
  // 3번 Mock API
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
        countMeta: {
          total: 10,
          tag1: { tag: 'I', count: '7' },
          tag2: { tag: 'E', count: '3' },
        },
      })),
      voteCount: question.votes.length,
      votedAnswerId: userVote ? userVote.answerId : null,
    };
  }

  // 4. 댓글 목록 반환
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

  // 5. 댓글 작성
  async createComment(commentData: {
    testerId: string;
    questionId: number;
    mbti: string;
    content: string;
  }) {
    let tester = await this.prisma.tester.findUnique({
      where: { testerId: commentData.testerId },
    });

    if (!tester) {
      tester = await this.prisma.tester.create({
        data: { testerId: commentData.testerId, mbti: commentData.mbti },
      });
    }

    const newComment = await this.prisma.comment.create({
      data: commentData,
    });

    return {
      message: '댓글이 작성되었습니다',
      data: newComment,
    };
  }

  // 6. 답변 투표
  async vote(voteData: {
    testerId: string;
    questionId: number;
    answerId: number;
    mbti: string;
  }) {
    const { testerId, questionId, answerId, mbti } = voteData;
    // tester 데이터 생성
    let tester = await this.prisma.tester.findUnique({
      where: { testerId },
    });

    if (!tester) {
      tester = await this.prisma.tester.create({
        data: {
          testerId,
          mbti,
        },
      });
    }

    const newVote = await this.prisma.vote.create({
      data: voteData,
    });

    // 투표한 답변의 countMeta 업데이트
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (answer) {
      const countMeta: any = answer.countMeta || {};

      const [tag1, tag2] =
        answer.question.type === 'energy'
          ? ['I', 'E']
          : answer.question.type === 'information'
            ? ['S', 'N']
            : answer.question.type === 'decision'
              ? ['T', 'F']
              : ['P', 'J'];

      const count1 = await this.prisma.vote.findMany({
        where: {
          questionId,
        },
      });

      const updatedCountMeta = {
        total: (countMeta.total || 0) + 1,
      };

      await this.prisma.answer.update({
        where: { id: voteData.answerId },
        data: {
          countMeta: updatedCountMeta,
        },
      });
    }

    return {
      message: '투표가 완료되었습니다',
      data: newVote,
    };
  }

  // // 7. 결과지 상세 반환
  // async getTestResultById(id: string) {
  //   const testResult = await this.prisma.result.findUnique({
  //     where: { id: parseInt(id) },
  //     include: {
  //       testAnswers: {
  //         include: {
  //           question: {
  //             include: {
  //               answers: true,
  //             },
  //           },
  //           answer: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!testResult) {
  //     throw new Error('존재하지 않는 결과지입니다.');
  //   }

  //   const changedQuestions = testResult.testAnswers.map((testAnswer) => {
  //     const prevType =
  //       testAnswer.answer.tag === 'I'
  //         ? 'E'
  //         : testAnswer.answer.tag === 'E'
  //           ? 'I'
  //           : testAnswer.answer.tag === 'S'
  //             ? 'N'
  //             : testAnswer.answer.tag === 'N'
  //               ? 'S'
  //               : testAnswer.answer.tag === 'T'
  //                 ? 'F'
  //                 : testAnswer.answer.tag === 'F'
  //                   ? 'T'
  //                   : testAnswer.answer.tag === 'J'
  //                     ? 'P'
  //                     : 'J';

  //     return {
  //       prevType,
  //       nextType: testAnswer.answer.tag,
  //       title: `너 ${testAnswer.question.type} 아닌 거 같은데?`,
  //       question: {
  //         id: testAnswer.question.id,
  //         type: testAnswer.question.type,
  //         content: testAnswer.question.content,
  //         answerList: testAnswer.question.answers.map((answer) => ({
  //           id: answer.id,
  //           content: answer.content,
  //           tag: answer.tag,
  //           countMeta: answer.countMeta,
  //         })),
  //         votedAnswerId: testAnswer.answer.id,
  //       },
  //     };
  //   });

  //   const recommendQuestions = await this.prisma.question.findMany({
  //     where: {
  //       id: {
  //         notIn: changedQuestions.map((q) => q.question.id),
  //       },
  //     },
  //     take: 2,
  //   });

  //   return {
  //     id: testResult.id,
  //     prevMbti: testResult.prevMbti,
  //     nextMbti: testResult.nextMbti,
  //     description: testResult.description,
  //     imageUrl: testResult.imageUrl,
  //     changedQuestions,
  //     recommendQuestions: recommendQuestions.map((question) => ({
  //       id: question.id,
  //       type: question.type,
  //       content: question.content,
  //     })),
  //   };
  // }
  // 7 - Mock API
  // 7. 결과지 상세 반환
  async getTestResultById(id: string) {
    const testResult = await this.prisma.result.findUnique({
      where: { id: parseInt(id) },
      include: {
        testAnswers: {
          include: {
            question: {
              include: {
                answers: true,
              },
            },
            answer: true,
          },
        },
      },
    });

    if (!testResult) {
      throw new Error('존재하지 않는 결과지입니다.');
    }

    const changedQuestions = testResult.testAnswers.map((testAnswer) => {
      const prevType =
        testAnswer.answer.tag === 'I'
          ? 'E'
          : testAnswer.answer.tag === 'E'
            ? 'I'
            : testAnswer.answer.tag === 'S'
              ? 'N'
              : testAnswer.answer.tag === 'N'
                ? 'S'
                : testAnswer.answer.tag === 'T'
                  ? 'F'
                  : testAnswer.answer.tag === 'F'
                    ? 'T'
                    : testAnswer.answer.tag === 'J'
                      ? 'P'
                      : 'J';

      return {
        prevType,
        nextType: testAnswer.answer.tag,
        title: `너 ${testAnswer.question.type} 아닌 거 같은데?`,
        question: {
          id: testAnswer.question.id,
          type: testAnswer.question.type,
          content: testAnswer.question.content,
          answerList: testAnswer.question.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            tag: answer.tag,
            countMeta: {
              total: 10,
              tag1: { tag: 'I', count: '7' },
              tag2: { tag: 'E', count: '3' },
            },
          })),
          votedAnswerId: testAnswer.answer.id,
        },
      };
    });

    const recommendQuestions = await this.prisma.question.findMany({
      where: {
        id: {
          notIn: changedQuestions.map((q) => q.question.id),
        },
      },
      take: 2,
    });

    return {
      id: testResult.id,
      prevMbti: testResult.prevMbti,
      nextMbti: testResult.nextMbti,
      description: testResult.description,
      imageUrl: testResult.imageUrl,
      changedQuestions,
      recommendQuestions: recommendQuestions.map((question) => ({
        id: question.id,
        type: question.type,
        content: question.content,
      })),
    };
  }

  // 8. 결과지 생성
  async createResult(body: {
    answerId: number[];
    testerId: string;
    prevMbti: string;
  }) {
    const { answerId, testerId, prevMbti } = body;
    // tester 데이터 생성
    let tester = await this.prisma.tester.findUnique({
      where: { testerId: body.testerId },
    });

    if (!tester) {
      tester = await this.prisma.tester.create({
        data: {
          testerId,
          mbti: prevMbti,
        },
      });
    }

    const answerCounts = {
      I: 0,
      E: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    // 각 답변의 태그를 확인하여 카운트를 증가
    for (const answerId of body.answerId) {
      const answer = await this.prisma.answer.findUnique({
        where: { id: answerId },
      });
      if (answer) {
        answerCounts[answer.tag]++;
      }
    }

    // 각 MBTI 타입별로 더 많이 선택된 쪽을 기준으로 새로운 MBTI 결정
    const nextMbti = `${answerCounts.I >= answerCounts.E ? 'I' : 'E'}${
      answerCounts.S >= answerCounts.N ? 'S' : 'N'
    }${answerCounts.T >= answerCounts.F ? 'T' : 'F'}${
      answerCounts.J >= answerCounts.P ? 'J' : 'P'
    }`;

    const testAnswerData = [];

    for (const answerId of body.answerId) {
      const answer = await this.prisma.answer.findUnique({
        where: { id: answerId },
        include: { question: true },
      });

      if (answer && answer.question) {
        testAnswerData.push({
          answerId: answer.id,
          questionId: answer.question.id,
        });
      }
    }

    const baseUrl = 'https://fake-enfp.shop';
    const lastImageName = `/public/${nextMbti}.png`;

    const newResult = await this.prisma.result.create({
      data: {
        testerId: body.testerId,
        prevMbti: body.prevMbti,
        nextMbti,
        description: `이전 MBTI: ${body.prevMbti}, 새로운 MBTI: ${nextMbti}`,
        imageUrl: `${baseUrl}${lastImageName}`,
        testAnswers: {
          create: testAnswerData,
        },
      },
    });

    return {
      resultId: newResult.id,
    };
  }
}
