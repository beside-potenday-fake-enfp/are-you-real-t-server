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

    // 결과지에서 mbti 새롭게 바뀐 경우, 신규 mbti로 업데이트
    const newMbti = mbti != tester.mbti ? tester.mbti : mbti;

    const newComment = await this.prisma.comment.create({
      data: {
        testerId,
        questionId,
        mbti: newMbti,
        content,
      },
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

    const mbtiTags = [
      { index: 0, type: 'energy', tags: ['I', 'E'] },
      { index: 1, type: 'information', tags: ['S', 'N'] },
      { index: 2, type: 'decision', tags: ['T', 'F'] },
      { index: 3, type: 'lifeStyle', tags: ['P', 'J'] },
    ];

    let changedQuestions = await Promise.all(
      mbtiTags.map(async (tagInfo) => {
        const prevType = testResult.prevMbti[tagInfo.index];
        const nextType = testResult.nextMbti[tagInfo.index];

        if (prevType !== nextType) {
          const relatedTestAnswer = testResult.testAnswers.find(
            (testAnswer) =>
              testAnswer?.answer?.tag === nextType &&
              testAnswer?.question?.type === tagInfo.type,
          );
          if (relatedTestAnswer) {
            const tagDescription = await this.prisma.tagDescription.findUnique({
              where: {
                tag: nextType,
              },
            });
            const voteCount = relatedTestAnswer.question.answers.reduce(
              (total, answer) => total + (answer.selectCount || 0),
              0,
            );

            return {
              prevType,
              nextType,
              title: tagDescription?.description,
              question: {
                id: relatedTestAnswer.question.id,
                type: relatedTestAnswer.question.type,
                content: relatedTestAnswer.question.content,
                answerList: relatedTestAnswer.question.answers.map(
                  (answer) => ({
                    id: answer.id,
                    content: answer.content,
                    tag: answer.tag,
                    selectCount: answer.selectCount || 0,
                  }),
                ),
                voteCount,
                votedAnswerId: relatedTestAnswer.answer.id,
              },
            };
          }
        }
      }),
    );

    const filteredChangedQuestions = changedQuestions.filter(Boolean);

    // 태그가 변경된 것이 없으면 유저가 고른 질문 중
    if (filteredChangedQuestions.length === 0) {
      const randomTestAnswer =
        testResult.testAnswers[
          Math.floor(Math.random() * testResult.testAnswers.length)
        ];
      const randomAnswer = randomTestAnswer.answer;

      // prevType은 randomAnswer의 반대 타입으로 설정
      const prevType =
        randomAnswer.tag === 'I'
          ? 'E'
          : randomAnswer.tag === 'E'
            ? 'I'
            : randomAnswer.tag === 'S'
              ? 'N'
              : randomAnswer.tag === 'N'
                ? 'S'
                : randomAnswer.tag === 'T'
                  ? 'F'
                  : randomAnswer.tag === 'F'
                    ? 'T'
                    : randomAnswer.tag === 'J'
                      ? 'P'
                      : 'J';

      const tagDescription = await this.prisma.tagDescription.findUnique({
        where: {
          tag: randomAnswer.tag,
        },
      });

      const voteCount = randomTestAnswer.question.answers.reduce(
        (total, answer) => total + (answer.selectCount || 0),
        0,
      );

      const questionForChange = {
        prevType,
        nextType: randomAnswer.tag,
        title: tagDescription?.description,
        question: {
          id: randomTestAnswer.question.id,
          type: randomTestAnswer.question.type,
          content: randomTestAnswer.question.content,
          answerList: randomTestAnswer.question.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            tag: answer.tag,
            selectCount: answer.selectCount || 0,
          })),
          voteCount,
          votedAnswerId: randomAnswer.id,
        },
      };

      changedQuestions = [questionForChange];
    }

    // 유저가 검증에서 선택한 질문(testAnswers)에 해당하는 질문의 id를 추출
    const testAnswerQuestionIds = testResult.testAnswers.map(
      (testAnswer) => testAnswer.question.id,
    );

    const recommendQuestions = await this.prisma.question.findMany({
      where: {
        id: {
          notIn: [
            ...changedQuestions
              .filter((q) => q?.question)
              .map((q) => q.question.id),
            ...testAnswerQuestionIds,
          ],
        },
      },
    });
    const twoRecommendQuestions = recommendQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    return {
      id: testResult.id,
      prevMbti: testResult.prevMbti,
      nextMbti: testResult.nextMbti,
      description: testResult.description,
      imageUrl: testResult.imageUrl,
      changedQuestions,
      recommendQuestions: twoRecommendQuestions.map((question) => ({
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
      where: { id: body.testerId },
    });

    if (!tester) {
      tester = await this.prisma.tester.create({
        data: {
          id: testerId,
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

      // 각 답변에 대한 투표 생성
      await this.prisma.vote.create({
        data: {
          testerId: testerId,
          questionId: answer.question.id,
          answerId: answer.id,
        },
      });
      // 투표한 답변의 selectCount 증가
      await this.prisma.answer.update({
        where: { id: answer.id },
        data: {
          selectCount: { increment: 1 },
        },
      });
    }

    const baseUrl = 'https://fake-enfp.shop';
    const lastImageName = `/public/${nextMbti}.png`;
    const mbtiDescription = await this.prisma.mbtiDescription.findUnique({
      where: {
        mbti: nextMbti,
      },
    });

    const newResult = await this.prisma.result.create({
      data: {
        testerId: body.testerId,
        prevMbti: body.prevMbti,
        nextMbti,
        description: mbtiDescription.description,
        imageUrl: `${baseUrl}${lastImageName}`,
        testAnswers: {
          create: testAnswerData,
        },
      },
    });

    const resultDetail = await this.getTestResultById(newResult.id.toString());

    return resultDetail;
  }
}
