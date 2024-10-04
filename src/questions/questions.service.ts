import { Injectable } from '@nestjs/common';
const questionArray = [
  {
    id: '1',
    type: 'energy',
    content: '한 가지 방식으로만 말할 수 있다면?',
    imageUrl: '',
    answerList: [
      {
        id: '1',
        content:
          '거미들이 입이 거미집인 줄 알고 찾아올 만큼 입에 거미줄 치고 살기',
        tag: 'I',
        selectCount: 0,
      },
      {
        id: '2',
        content: '1분에 한번씩 지나가는 사람들한테 말 걸고 친구되기',
        tag: 'E',
        selectCount: 5,
      },
    ],
    voteCount: 5,
    commentCount: 2,
  },
  {
    id: '2',
    type: 'energy',
    content: '평생 주말을 한 가지 방법으로만 보낸다면?',
    imageUrl: '',
    answerList: [
      {
        id: '3',
        content: '바깥공기 알러지 있어서 맨날 집에 칩거하기',
        tag: 'I',
        selectCount: 10,
      },
      {
        id: '4',
        content: '침대에 10분이상 있으면 몸에 두드러기 나서 맨날 외출하기',
        tag: 'E',
        selectCount: 20,
      },
    ],
    voteCount: 30,
    commentCount: 9,
  },
  {
    id: '3',
    type: 'energy',
    content: '팀 프로젝트, 회의에서 한 가지만 할 수 있다면?',
    imageUrl: '',
    answerList: [
      {
        id: '5',
        content: 'A부터 Z까지 전부 듣고 의사결정 받기 ',
        tag: 'I',
        selectCount: 0,
      },
      {
        id: '6',
        content: 'A부터 Z까지 전부 의사결정 하기',
        tag: 'E',
        selectCount: 30,
      },
    ],
    voteCount: 30,
    commentCount: 1,
  },
  {
    id: '4',
    type: 'information',
    content: '평생 취미를 하나만 가질 수 있다면?',
    imageUrl: '',
    answerList: [
      {
        id: '7',
        conent: '평생 망원경으로 우주 관측하고 칼세이건 되기',
        tag: 'S',
        selectCount: 120,
      },
      {
        id: '8',
        content: '평생 현미경으로 미생물 관찰하고 파스퇴르 되기',
        tag: 'N',
        selectCount: 30,
      },
    ],
    voteCount: 150,
    commentCount: 6,
  },
  {
    id: '5',
    type: 'information',
    content: '샤워할 때 하는 생각은?',
    imageUrl: '',
    answerList: [
      {
        id: '9',
        conent: '샤워할 때 머리 시원하게 긁는 것에 집중하기',
        tag: 'S',
        selectCount: 60,
      },
      {
        id: '10',
        content:
          '샤워할 때 유튜브 시작해서 1000만 구독자 달성한 다음 주식 대박나서 은퇴하고 세계여행 다니는 상상하기',
        tag: 'N',
        selectCount: 70,
      },
    ],
    voteCount: 130,
    commentCount: 1,
  },
  {
    id: '6',
    type: 'information',
    content: '누군가를 좋아하기 시작한다면?',
    imageUrl: '',
    answerList: [
      {
        id: '11',
        conent: '그 사람과 어떻게 더 친해질 수 있을지 생각하기',
        tag: 'S',
        selectCount: 80,
      },
      {
        id: '12',
        content:
          '결혼하고 가족을 꾸리고 40년 뒤 손주를 보는 상상하고 눈물 흘리기',
        tag: 'N',
        selectCount: 90,
      },
    ],
    voteCount: 170,
    commentCount: 8,
  },
  {
    id: '7',
    type: 'decision',
    content: '발 없는 말이 ____',
    imageUrl: '',
    answerList: [
      {
        id: '13',
        content: '천 리 간다',
        tag: 'T',
        selectCount: 100,
      },
      {
        id: '14',
        content: '어쩐지 슬프다……',
        tag: 'F',
        selectCount: 110,
      },
    ],
    voteCount: 210,
    commentCount: 6,
  },
  {
    id: '8',
    type: 'decision',
    content: '인생이 막막할 때 나는',
    imageUrl: '',
    answerList: [
      {
        id: '15',
        content: '양철로봇이라 눈물같은 건 흘리지 않는다',
        tag: 'T',
        selectCount: 120,
      },
      {
        id: '16',
        content: '시원하게 오열 질러본다',
        tag: 'F',
        selectCount: 130,
      },
    ],
    voteCount: 250,
    commentCount: 2,
  },
  {
    id: '9',
    type: 'decision',
    content: '슬픔을 나누면',
    imageUrl: '',
    answerList: [
      {
        id: '17',
        content: '슬픈 사람이 둘',
        tag: 'T',
        selectCount: 140,
      },
      {
        id: '18',
        content: '반이 된다',
        tag: 'F',
        selectCount: 150,
      },
    ],
    voteCount: 290,
    commentCount: 4,
  },
  {
    id: '10',
    type: 'lifeStyle',
    content: '다음 날 입을 옷을 고른다면?',
    imageUrl: '',
    answerList: [
      {
        id: '19',
        content:
          '아침에 Chat GPT한테 물어봐서 그날 옷 랜덤으로 정하기(근데 옷이 ENFP 무지개 옷 검색하면 나오는 반팔티 같은 거)',
        tag: 'P',
        selectCount: 160,
      },
      {
        id: '20',
        content: '전날 밤 입을 옷 3벌 정하고 다음 날 세 번 옷 갈아입기',
        tag: 'J',
        selectCount: 170,
      },
    ],
    voteCount: 330,
    commentCount: 5,
  },
  {
    id: '11',
    type: 'lifeStyle',
    content: '통학/통근 시간을 고를 수 있다면?',
    imageUrl: '',
    answerList: [
      {
        id: '21',
        content: '1분 아님 2시간 매일 랜덤으로 동전던져서 결정하기',
        tag: 'P',
        selectCount: 180,
      },
      {
        id: '22',
        content: '매일 1시간 고정하기',
        tag: 'J',
        selectCount: 190,
      },
    ],
    voteCount: 370,
    commentCount: 5,
  },
  {
    id: '12',
    type: 'lifeStyle',
    content: '자격증 시험을 준비하는 방식은?',
    imageUrl: '',
    answerList: [
      {
        id: '23',
        content: '일단 시험부터 접수하고 공부 계획 세우기',
        tag: 'P',
        selectCount: 200,
      },
      {
        id: '24',
        content: '일단 공부 계획 다 세우고 시험 접수하기',
        tag: 'J',
        selectCount: 210,
      },
    ],
    voteCount: 410,
    commentCount: 0,
  },
];
const commentArray = [
  {
    id: '1',
    testerId: '1',
    questionId: '1',
    mbti: 'ESTJ',
    content: '댓글내용내용내용',
    createdAt: '2024-10-02T10:30:00Z',
  },
  {
    id: '2',
    testerId: '1',
    questionId: '1',
    mbti: 'ENFP',
    content: '댓글댓글내용내용',
    createdAt: '2024-10-02T10:45:00Z',
  },
  {
    id: '3',
    testerId: '2',
    questionId: '2',
    mbti: 'ESTJ',
    content: '댓글댓글내용내용용',
    createdAt: '2024-10-02T10:45:00Z',
  },
];

const voteArray = [
  // {
  //   id: '1',
  //   testerId: '1',
  //   questionId: '1',
  //   answerId: '1',
  // },
  // {
  //   id: '2',
  //   testerId: '1',
  //   questionId: '2',
  //   answerId: '4',
  // },
  // {
  //   id: '3',
  //   testerId: '2',
  //   questionId: '1',
  //   answerId: '2',
  // },
];

const testResultArray = [
  {
    id: '1',
    prevMbti: 'INFJ',
    nextMbti: 'ENTJ',
    description: '간략한 설명 두줄',
    imageUrl: '',
    changedQuestions: [
      {
        prevType: 'I',
        nextType: 'E',
        title: '너 I 아닌 거 같은데?',
        question: {
          id: '1',
          type: 'energy',
          content: '평생 주말을 한 가지 방법으로만 보낸다면?',
          answerList: [
            {
              id: '1',
              content: '바깥공기 알러지 있어서 맨날 집에 칩거하기',
              tag: 'I',
              countMeta: {
                total: 10,
                tag1: { tag: 'I', count: 7 },
                tag2: { tag: 'E', count: 3 },
              },
            },
            {
              id: '2',
              content:
                '침대에 10분 이상 있으면 몸에 두드러기 나서 맨날 외출하기',
              tag: 'E',
              countMeta: {
                total: 20,
                tag1: { tag: 'I', count: 8 },
                tag2: { tag: 'E', count: 12 },
              },
            },
          ],
          votedAnswerId: '1',
        },
      },
      {
        prevType: 'N',
        nextType: 'S',
        title: '너 N 아닌 거 같은데?',
        question: {
          id: '5',
          type: 'information',
          content: '질문 내용',
          answerList: [
            {
              id: '3',
              content: '바깥공기 알러지 있어서 맨날 집에 칩거하기',
              tag: 'S',
              countMeta: {
                total: 10,
                tag1: { tag: 'S', count: 6 },
                tag2: { tag: 'N', count: 4 },
              },
            },
            {
              id: '4',
              content:
                '침대에 10분 이상 있으면 몸에 두드러기 나서 맨날 외출하기',
              tag: 'N',
              countMeta: {
                total: 15,
                tag1: { tag: 'S', count: 5 },
                tag2: { tag: 'N', count: 10 },
              },
            },
          ],
          votedAnswerId: '4',
        },
      },
    ],
    recommendQuestions: [
      {
        id: '4',
        type: 'information',
        content: '질문 내용용',
      },
      {
        id: '6',
        type: 'energy',
        content: '질문 내용용용',
      },
    ],
  },
];

@Injectable()
export class QuestionsService {
  private test = [];

  // 1. 12개 질문지 랜덤 반환(각 타입별 비율 맞춰서) - 완료
  get12RandomQuestions() {
    return questionArray
      .map((question) => ({
        id: question.id,
        content: question.content,
        imageUrl: question.imageUrl,
        answerList: question.answerList.map((answer) => ({
          id: answer.id,
          content: answer.content,
        })),
      }))
      .slice(0, 12);
  }

  // 2. 전체 질문지 반환 - 완료
  getAllQuestions() {
    return questionArray.map((question) => ({
      id: question.id,
      type: question.type,
      content: question.content,
      answerList: question.answerList.map((answer) => ({
        id: answer.id,
        content: answer.content,
      })),
      voteCount: question.voteCount,
      commentCount: question.commentCount,
    }));
  }

  // 3. 질문지 상세 반환 - 완료(투표한 answerId 반환 로직 제외)
  getQuestionById(id: string, testerId: string) {
    const question = questionArray.find((q) => q.id === id);

    const userVote = voteArray.find(
      (vote) => vote.testerId === testerId && vote.questionId === id,
    );

    return {
      id: question.id,
      type: question.type,
      content: question.content,
      imageUrl: question.imageUrl,
      answerList: question.answerList.map((answer) => ({
        id: answer.id,
        content: answer.content,
        tag: answer.tag,
        selectCount: answer.selectCount,
      })),
      voteCount: question.voteCount,
      votedAnswerId: userVote ? userVote.answerId : null,
    };
  }

  // 4. 댓글 목록 반환 - 완료
  getCommentsByQuestionId(questionId: string) {
    const comments = commentArray.filter(
      (comment) => comment.questionId === questionId,
    );
    console.log(commentArray);

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

  // 5. 댓글 작성 - 완료
  createComment(commentData: {
    testerId: string;
    questionId: string;
    mbti: string;
    content: string;
  }) {
    const { testerId, questionId, mbti, content } = commentData;

    const newComment = {
      id: (commentArray.length + 1).toString(),
      testerId: testerId.toString(),
      questionId: questionId.toString(),
      mbti,
      content,
      createdAt: new Date().toISOString(),
    };

    commentArray.push(newComment);

    return {
      message: '댓글이 작성되었습니다',
      data: newComment,
    };
  }

  // 6. 답변 투표 - 완료
  vote(voteData: { testerId: string; questionId: string; answerId: string }) {
    const { testerId, questionId, answerId } = voteData;

    const newVote = {
      id: (voteArray.length + 1).toString(),
      testerId,
      questionId,
      answerId,
    };
    voteArray.push(newVote);

    return {
      message: '투표가 완료되었습니다',
      data: newVote,
    };
  }

  // 7. 결과지 상세 반환 -
  getTestResultById(id: string) {
    const testResult = testResultArray.find(
      (testResult) => testResult.id === id,
    );

    return testResult;
  }

  // 8. 결과지 생성
  createResult(body: any) {
    const { answerId, testerId, prevMbti } = body;

    return {
      resultId: (testResultArray.length + 1).toString(),
    };
  }
}
