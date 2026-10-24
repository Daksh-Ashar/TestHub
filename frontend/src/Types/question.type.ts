export type Option = {
  optionId: string;
  contentType: string;
  contentValue: string;
  isCorrect: boolean;
};

export type Question = {
  _id: string;
  testId: string;
  questionText: string;
  options: Option[];
};

