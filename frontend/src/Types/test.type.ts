export type Test = {
    _id: string;
    title: string;
    isPublished: boolean;
    status: "Draft" | "Published";
    classId: string;
    duration: number; // in minutes
  };


  export type OverallTests = {
        "_id": string,
        "testId": {
            "_id": string,
            "title": string
        },
        "participantId": string,
        "answers": [
            {
                "questionId": string,
                "selectedOptionId": string
            }
        ],
        "score": number,
        "createdAt": string,
        "updatedAt": string
    }