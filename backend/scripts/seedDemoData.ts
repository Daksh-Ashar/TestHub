import "dotenv/config";

import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { ROLES } from "../src/constants/roles.js";
import { ClassModel } from "../src/modules/class/class.model.js";
import { generateJoinCode } from "../src/modules/class/class.service.js";
import { TestModel } from "../src/modules/Exam/test.model.js";
import { QuestionModel } from "../src/modules/question/question.model.js";
import type { Option } from "../src/modules/question/question.model.js";
import { SubmissionModel } from "../src/modules/submission/submission.model.js";
import { User } from "../src/modules/user/User.js";

const creatorFixture = {
  name: "Web Development Instructor",
  email: "instructor@webdev-demo.test",
};

const participantFixtures = [
  { name: "Jordan Lee", email: "jordan.lee@webdev-demo.test", incorrect: [0] },
  { name: "Avery Patel", email: "avery.patel@webdev-demo.test", incorrect: [1, 3] },
  { name: "Morgan Rivera", email: "morgan.rivera@webdev-demo.test", incorrect: [0, 2, 4] },
  { name: "Taylor Kim", email: "taylor.kim@webdev-demo.test", incorrect: [] },
  { name: "Casey Nguyen", email: "casey.nguyen@webdev-demo.test", incorrect: [2, 3] },
  { name: "Riley Brooks", email: "riley.brooks@webdev-demo.test", incorrect: [1, 2, 5] },
  { name: "Jamie Okafor", email: "jamie.okafor@webdev-demo.test", incorrect: [0, 1, 2, 3] },
  { name: "Cameron Silva", email: "cameron.silva@webdev-demo.test", incorrect: [4, 5] },
];

const className = "Web Development Foundations - Demo Cohort";
const testTitle = "HTML and CSS Foundations Checkpoint";

const questionFixtures: {
  questionText: string;
  options: Option[];
}[] = [
  {
    questionText: "Which HTML element is intended for the primary content of a page?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "<main>", isCorrect: true },
      { optionId: "b", contentType: "text", contentValue: "<footer>", isCorrect: false },
      { optionId: "c", contentType: "text", contentValue: "<aside>", isCorrect: false },
      { optionId: "d", contentType: "text", contentValue: "<head>", isCorrect: false },
    ],
  },
  {
    questionText: "How should a label be associated with an input in HTML?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "Give both elements the same class", isCorrect: false },
      { optionId: "b", contentType: "text", contentValue: "Match the label's for value to the input's id", isCorrect: true },
      { optionId: "c", contentType: "text", contentValue: "Place the input inside the head element", isCorrect: false },
      { optionId: "d", contentType: "text", contentValue: "Set the label's href to the input name", isCorrect: false },
    ],
  },
  {
    questionText: "What should the alt attribute describe for an informative image?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "The image's file size", isCorrect: false },
      { optionId: "b", contentType: "text", contentValue: "The CSS used to display the image", isCorrect: false },
      { optionId: "c", contentType: "text", contentValue: "The image's meaningful content or purpose", isCorrect: true },
      { optionId: "d", contentType: "text", contentValue: "The page's URL", isCorrect: false },
    ],
  },
  {
    questionText: "Which selector has the highest specificity?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "A type selector such as p", isCorrect: false },
      { optionId: "b", contentType: "text", contentValue: "A class selector such as .card", isCorrect: false },
      { optionId: "c", contentType: "text", contentValue: "A universal selector such as *", isCorrect: false },
      { optionId: "d", contentType: "text", contentValue: "An ID selector such as #header", isCorrect: true },
    ],
  },
  {
    questionText: "With the default content-box sizing, what does a declared width exclude?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "The content area", isCorrect: false },
      { optionId: "b", contentType: "text", contentValue: "Padding and border", isCorrect: true },
      { optionId: "c", contentType: "text", contentValue: "The element's text", isCorrect: false },
      { optionId: "d", contentType: "text", contentValue: "The width value itself", isCorrect: false },
    ],
  },
  {
    questionText: "In a flex container, which property aligns items along the cross axis?",
    options: [
      { optionId: "a", contentType: "text", contentValue: "align-items", isCorrect: true },
      { optionId: "b", contentType: "text", contentValue: "font-weight", isCorrect: false },
      { optionId: "c", contentType: "text", contentValue: "text-transform", isCorrect: false },
      { optionId: "d", contentType: "text", contentValue: "border-collapse", isCorrect: false },
    ],
  },
];

const upsertUser = async (
  name: string,
  email: string,
  role: (typeof ROLES)[keyof typeof ROLES],
  passwordHash: string,
) =>
  User.findOneAndUpdate(
    { email },
    { $set: { name, role, password: passwordHash } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

const seedDemoData = async () => {
  if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
    throw new Error("Set NODE_ENV to development or test before running the demo seeder.");
  }
  if (process.env.SEED_DEMO_DATA !== "true") {
    throw new Error("Set SEED_DEMO_DATA=true to confirm demo seeding.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must point to a development or test database.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const password =
    process.env.DEMO_SEED_PASSWORD || randomBytes(32).toString("hex");
  const passwordHash = await bcrypt.hash(password, 10);

  const creator = await upsertUser(
    creatorFixture.name,
    creatorFixture.email,
    ROLES.CREATOR,
    passwordHash,
  );
  const participants = await Promise.all(
    participantFixtures.map((participant) =>
      upsertUser(
        participant.name,
        participant.email,
        ROLES.PARTICIPANT,
        passwordHash,
      ),
    ),
  );

  let joinCode = generateJoinCode();
  while (await ClassModel.exists({ joinCode })) {
    joinCode = generateJoinCode();
  }

  const demoClass = await ClassModel.findOneAndUpdate(
    { name: className, creatorId: creator._id },
    {
      $set: {
        description: "A sample cohort for practicing foundational HTML and CSS.",
      },
      $setOnInsert: { joinCode },
      $addToSet: { participants: { $each: participants.map(({ _id }) => _id) } },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const test = await TestModel.findOneAndUpdate(
    { classId: demoClass._id, title: testTitle },
    {
      $set: {
        description: "A six-question checkpoint on semantic HTML and CSS fundamentals.",
        duration: 20,
        isPublished: true,
        createdBy: creator._id,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const questions = await Promise.all(
    questionFixtures.map((question) =>
      QuestionModel.findOneAndUpdate(
        { testId: test._id, questionText: question.questionText },
        { $set: { options: question.options, createdBy: creator._id } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const questionsById = new Map(
    questions.map((question) => [question._id.toString(), question]),
  );

  for (const [participantIndex, participant] of participants.entries()) {
    const incorrectQuestionIndexes = new Set(
      participantFixtures[participantIndex]!.incorrect,
    );
    const answers = questions.map((question, questionIndex) => {
      const option = incorrectQuestionIndexes.has(questionIndex)
        ? question.options.find(({ isCorrect }) => !isCorrect)
        : question.options.find(({ isCorrect }) => isCorrect);

      if (!option) {
        throw new Error(`Question "${question.questionText}" has no suitable option.`);
      }

      return {
        questionId: question._id,
        selectedOptionId: option.optionId,
      };
    });

    const score = answers.reduce((total, answer) => {
      const question = questionsById.get(answer.questionId.toString());
      const selectedOption = question?.options.find(
        ({ optionId }) => optionId === answer.selectedOptionId,
      );
      return total + Number(selectedOption?.isCorrect ?? false);
    }, 0);

    await SubmissionModel.findOneAndUpdate(
      { testId: test._id, participantId: participant._id },
      {
        $set: { answers, score },
        $setOnInsert: { testId: test._id, participantId: participant._id },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  console.info(
    `Seeded demo class "${className}" with ${participants.length} participants, ${questions.length} questions, and submissions.`,
  );
};

try {
  await seedDemoData();
} catch (error: unknown) {
  console.error("Demo data seeding failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
