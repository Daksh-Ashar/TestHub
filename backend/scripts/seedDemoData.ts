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

const className = "Web Development Foundations - Demo Cohort";
type ParticipantFixture = {
  name: string;
  email: string;
  htmlIncorrect: number[];
  cssIncorrect: number[];
};

const makeParticipant = (
  name: string,
  htmlIncorrect: number[],
  cssIncorrect: number[],
): ParticipantFixture => ({
  name,
  email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@webdev-demo.test`,
  htmlIncorrect,
  cssIncorrect,
});

const participantFixtures = [
  makeParticipant("Jordan Lee", [0], [0, 2]),
  makeParticipant("Avery Patel", [1, 3], [1]),
  makeParticipant("Morgan Rivera", [0, 2, 4], [0, 2, 4]),
  makeParticipant("Taylor Kim", [], []),
  makeParticipant("Casey Nguyen", [2, 3], [2, 3]),
  makeParticipant("Riley Brooks", [1, 2, 5], [1, 2, 5]),
  makeParticipant("Jamie Okafor", [0, 1, 2, 3], [0, 1, 2, 3]),
  makeParticipant("Cameron Silva", [4, 5], [4, 5]),
  makeParticipant("Quinn Parker", [0, 5], [1, 3, 5]),
  makeParticipant("Priya Shah", [1], [0, 4]),
  makeParticipant("Eli Thompson", [2, 5], [2]),
  makeParticipant("Sofia Martinez", [0, 3, 4], [0, 3]),
  makeParticipant("Noah Chen", [3], [1, 2, 5]),
  makeParticipant("Amara Johnson", [1, 4], [2, 4]),
  makeParticipant("Lucas Martin", [0, 2], [0, 1, 2]),
  makeParticipant("Maya Desai", [5], [3]),
  makeParticipant("Ethan Williams", [1, 2, 3], [1, 4, 5]),
  makeParticipant("Zoe Anderson", [2], [0, 2, 3, 5]),
  makeParticipant("Mateo Garcia", [0, 1, 5], [1, 3]),
  makeParticipant("Nia Robinson", [3, 4], [4]),
  makeParticipant("Leo Kim", [1, 3, 5], [0, 3, 4]),
  makeParticipant("Isla Thompson", [0, 4], [0, 2]),
  makeParticipant("Arjun Mehta", [2, 3, 4], [2, 5]),
  makeParticipant("Grace Wilson", [5], [1, 4, 5]),
  makeParticipant("Omar Hassan", [0, 2, 4], [0, 1, 3, 5]),
  makeParticipant("Chloe Martin", [1, 5], [2, 3]),
  makeParticipant("Daniel Foster", [2, 3], [0, 4, 5]),
  makeParticipant("Leila Ahmed", [4], [1, 2]),
  makeParticipant("Ben Carter", [0, 3, 5], [3]),
  makeParticipant("Ana Costa", [1, 2], [0, 2, 4]),
];

type QuestionFixture = {
  questionText: string;
  options: Option[];
};

const makeQuestion = (
  questionText: string,
  correctOptionIndex: number,
  optionContents: string[],
): QuestionFixture => ({
  questionText,
  options: optionContents.map((contentValue, index) => ({
    optionId: String.fromCharCode(97 + index),
    contentType: "text",
    contentValue,
    isCorrect: index === correctOptionIndex,
  })),
});

type TestFixture = {
  title: string;
  description: string;
  duration: number;
  legacyTitle?: string;
  submissionPattern?: "html" | "css";
  questions: QuestionFixture[];
};

const testFixtures: TestFixture[] = [
  {
    title: "HTML Foundations",
    description: "Semantic structure, accessible forms, and essential HTML elements.",
    duration: 20,
    legacyTitle: "HTML and CSS Foundations Checkpoint",
    submissionPattern: "html",
    questions: [
      makeQuestion("Which element is intended for the primary content of a page?", 0, [
        "<main>", "<footer>", "<aside>", "<head>",
      ]),
      makeQuestion("How should a label be associated with an input?", 1, [
        "Give both elements the same class",
        "Match the label's for value to the input's id",
        "Place the input inside the head element",
        "Set the label's href to the input name",
      ]),
      makeQuestion("What should alt text describe for an informative image?", 2, [
        "The image's file size",
        "The CSS used to display the image",
        "The image's meaningful content or purpose",
        "The page's URL",
      ]),
      makeQuestion("Which element is best for a list where item order matters?", 0, [
        "<ol>", "<ul>", "<dl>", "<menuitem>",
      ]),
      makeQuestion("Where should a page's language be declared?", 1, [
        "On the body element as a class",
        "On the html element with the lang attribute",
        "In a meta tag's name attribute",
        "On every paragraph separately",
      ]),
      makeQuestion("Which button type submits its containing form?", 2, [
        "type=\"button\"", "type=\"reset\"", "type=\"submit\"", "type=\"form\"",
      ]),
    ],
  },
  {
    title: "CSS Foundations",
    description: "Selectors, the box model, layout, and responsive styling basics.",
    duration: 20,
    submissionPattern: "css",
    questions: [
      makeQuestion("Which selector has the highest specificity?", 3, [
        "A type selector such as p",
        "A class selector such as .card",
        "A universal selector such as *",
        "An ID selector such as #header",
      ]),
      makeQuestion("With content-box sizing, what does a declared width exclude?", 1, [
        "The content area",
        "Padding and border",
        "The element's text",
        "The width value itself",
      ]),
      makeQuestion("Which flexbox property aligns items along the cross axis?", 0, [
        "align-items", "font-weight", "text-transform", "border-collapse",
      ]),
      makeQuestion("Which at-rule is used to apply styles at a viewport breakpoint?", 2, [
        "@supports", "@container", "@media", "@keyframes",
      ]),
      makeQuestion("Which display value creates a two-dimensional grid layout?", 1, [
        "inline", "grid", "contents", "table-cell",
      ]),
      makeQuestion("Which flexbox property allows items to move onto another line?", 3, [
        "flex-grow", "align-content", "order", "flex-wrap",
      ]),
    ],
  },
  {
    title: "JavaScript Foundations",
    description: "Core JavaScript values, functions, arrays, and browser events.",
    duration: 20,
    questions: [
      makeQuestion("What happens when code tries to reassign a const variable?", 1, [
        "The value is silently changed",
        "A TypeError is thrown",
        "The variable becomes undefined",
        "The assignment is delayed",
      ]),
      makeQuestion("Which operator compares values without type coercion?", 0, [
        "===", "=", "==", "=>",
      ]),
      makeQuestion("What does Array.prototype.map() return?", 2, [
        "The first matching item",
        "The original array after sorting",
        "A new array containing transformed items",
        "A boolean indicating whether all items match",
      ]),
      makeQuestion("How do you register a click handler on a DOM element?", 1, [
        "element.on('click', handler)",
        "element.addEventListener('click', handler)",
        "element.listenClick(handler)",
        "element.click = add(handler)",
      ]),
      makeQuestion("What does calling an async function always return?", 3, [
        "A callback", "A generator", "A plain string", "A Promise",
      ]),
      makeQuestion("What does Array.prototype.filter() return?", 2, [
        "A number of matching items",
        "The first item that matches",
        "A new array of items that pass the condition",
        "A Promise for the matching items",
      ]),
    ],
  },
  {
    title: "React Foundations",
    description: "Components, props, state, lists, and controlled form inputs.",
    duration: 20,
    questions: [
      makeQuestion("How should a custom React component name begin?", 1, [
        "With a lowercase letter",
        "With an uppercase letter",
        "With an underscore",
        "With the word component",
      ]),
      makeQuestion("How should a component treat props it receives?", 0, [
        "As read-only inputs",
        "As state that it can directly mutate",
        "As DOM references",
        "As values that must be strings",
      ]),
      makeQuestion("Which hook adds local state to a function component?", 2, [
        "useMemo", "useEffect", "useState", "useContext",
      ]),
      makeQuestion("Why should list items have stable keys?", 3, [
        "To apply CSS styles automatically",
        "To make array values immutable",
        "To avoid creating event handlers",
        "To help React track items between renders",
      ]),
      makeQuestion("What makes an input controlled in React?", 1, [
        "It has a ref but no value prop",
        "Its value is driven by state and updated with onChange",
        "It is rendered outside a form",
        "It uses a defaultValue prop only",
      ]),
      makeQuestion("When is useEffect commonly used?", 2, [
        "To declare a component's props",
        "To return JSX from a component",
        "To synchronize with an external system",
        "To make a variable immutable",
      ]),
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
        description:
          "A sample cohort covering HTML, CSS, JavaScript, and React foundations.",
      },
      $setOnInsert: { joinCode },
      $addToSet: { participants: { $each: participants.map(({ _id }) => _id) } },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  for (const fixture of testFixtures) {
    let existingTest = await TestModel.findOne({
      classId: demoClass._id,
      title: fixture.title,
    });

    if (!existingTest && fixture.legacyTitle) {
      existingTest = await TestModel.findOneAndUpdate(
        { classId: demoClass._id, title: fixture.legacyTitle },
        { $set: { title: fixture.title } },
        { new: true },
      );
    }

    const test = await TestModel.findOneAndUpdate(
      { classId: demoClass._id, title: fixture.title },
      {
        $set: {
          description: fixture.description,
          duration: fixture.duration,
          isPublished: true,
          createdBy: creator._id,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const questions = await Promise.all(
      fixture.questions.map((question) =>
        QuestionModel.findOneAndUpdate(
          { testId: test._id, questionText: question.questionText },
          { $set: { options: question.options, createdBy: creator._id } },
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    if (fixture.submissionPattern) {
      for (const [participantIndex, participant] of participants.entries()) {
        const participantFixture = participantFixtures[participantIndex];
        if (!participantFixture) {
          throw new Error(`Missing participant fixture at index ${participantIndex}.`);
        }

        const incorrectQuestionIndexes = new Set(
          fixture.submissionPattern === "html"
            ? participantFixture.htmlIncorrect
            : participantFixture.cssIncorrect,
        );
        const answers = questions.map((question, questionIndex) => {
          const option = incorrectQuestionIndexes.has(questionIndex)
            ? question.options.find(({ isCorrect }) => !isCorrect)
            : question.options.find(({ isCorrect }) => isCorrect);

          if (!option) {
            throw new Error(
              `Question "${question.questionText}" has no suitable option.`,
            );
          }

          return {
            questionId: question._id,
            selectedOptionId: option.optionId,
          };
        });

        const questionsById = new Map(
          questions.map((question) => [question._id.toString(), question]),
        );
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
    } else {
      await SubmissionModel.deleteMany({
        testId: test._id,
        participantId: { $in: participants.map(({ _id }) => _id) },
      });
    }

    await QuestionModel.deleteMany({
      testId: test._id,
      _id: { $nin: questions.map(({ _id }) => _id) },
    });
  }

  console.info(
    `Seeded demo class "${className}" with ${participants.length} participants and ${testFixtures.length} tests. All participants have HTML and CSS submissions; JavaScript and React remain pending.`,
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
