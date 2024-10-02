import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionsService {
  private questions = [
    {
      id: '1',
      content: '평생 취미를 하나만 가질 수 있다면?',
      answerList: [
        {
          id: '1',
          conent: '평생 망원경으로 우주 관측하고 칼세이건 되기',
          tag: 'N',
        },
        {
          id: '2',
          content: '평생 현미경으로 미생물 관찰하고 파스퇴르 되기',
          tag: 'S',
        },
      ],
    },
    {
      id: '2',
      content: '인생이 막막할때',
      answerList: [
        {
          id: '3',
          text: '슬프다……',
          tag: 'F',
        },
        {
          id: '4',
          text: '천 리 간다',
          tag: 'T',
        },
      ],
    },
  ];

  findAll() {
    return this.questions;
  }

  findById(id: string) {
    return this.questions.find((question) => question.id === id);
  }
}
