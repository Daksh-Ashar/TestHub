import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import testConfig from "../../config/testConfig";
import TestShell from "../../Components/TestShell";
import Timer from "../../Components/Timer";

interface Option {
  optionId: string;
  contentValue: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: Option[];
}

type RequestStatus = "loading" | "success" | "empty" | "error";

const getResponseMessage = (error: unknown): string | undefined => {
  if (
    typeof error !== "object" ||
    error === null ||
    !("response" in error) ||
    typeof error.response !== "object" ||
    error.response === null ||
    !("data" in error.response) ||
    typeof error.response.data !== "object" ||
    error.response.data === null ||
    !("message" in error.response.data) ||
    typeof error.response.data.message !== "string"
  ) {
    return undefined;
  }

  return error.response.data.message;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const processQuestions = (
  data: Question[],
  shuffleQuestions: boolean,
  shuffleOptions: boolean,
): Question[] => {
  let processed = data.map((q) => ({
    ...q,
    options: [...q.options],
  }));

  if (shuffleQuestions) {
    processed = shuffleArray(processed);
  }

  if (shuffleOptions) {
    processed = processed.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }

  return processed;
};

export default function TakeTest() {
  const { testId, classId } = useParams<{ testId: string; classId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsStatus, setQuestionsStatus] =
    useState<RequestStatus>("loading");
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const state = location.state as { duration?: number };

  const [duration, setDuration] = useState<number | null>(
    state?.duration ?? null,
  );
  const [detailsStatus, setDetailsStatus] = useState<RequestStatus>(
    state?.duration === undefined ? "loading" : "success",
  );
  const navigate = useNavigate();

  const fetchTestMeta = useCallback(async () => {
    if (!testId || duration !== null) return;

    setDetailsStatus("loading");
    try {
      const res = await api.get<{ duration: number }>(`/tests/${testId}/info`);
      if (!Number.isFinite(res.data.duration) || res.data.duration <= 0) {
        throw new Error("The test duration is unavailable.");
      }
      setDuration(res.data.duration * 60);
      setDetailsStatus("success");
    } catch (err) {
      if (getResponseMessage(err) === "Test already submitted") {
        navigate(`/participant/classes/${classId}/tests/${testId}/result`);
        return;
      }
      console.error("Test details request failed:", err);
      setDetailsStatus("error");
    }
  }, [classId, duration, navigate, testId]);

  const fetchQuestions = useCallback(async () => {
    if (!testId) {
      setQuestionsError("This test could not be identified.");
      setQuestionsStatus("error");
      return;
    }

    setQuestionsStatus("loading");
    setQuestionsError(null);
    try {
      const res = await api.get<Question[]>(`/questions/test/${testId}`);
      const finalQuestions = processQuestions(
        res.data,
        testConfig.shuffleQuestions,
        testConfig.shuffleOptions,
      );

      setQuestions(finalQuestions);
      setCurrentIndex(0);
      setQuestionsStatus(finalQuestions.length === 0 ? "empty" : "success");
    } catch (err) {
      if (getResponseMessage(err) === "Test already submitted") {
        navigate(`/participant/classes/${classId}/tests/${testId}/result`);
        return;
      }
      console.error("Questions request failed:", err);
      setQuestionsError("We couldn't load the questions for this test.");
      setQuestionsStatus("error");
    }
  }, [classId, navigate, testId]);

  // ================= FETCH TEST DATA =================
  useEffect(() => {
    void fetchTestMeta();
  }, [fetchTestMeta]);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  // ================= SELECT ANSWER =================
  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // ================= NAVIGATION =================
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (mode: "manual" | "auto" = "manual") => {
    if (!testId) return;

    const unanswered = questions.filter((q) => !answers[q._id]);

    if (mode === "manual" && unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        "You have unanswered questions. Submit anyway?",
      );

      if (!confirmSubmit) return;
    }

    const payload = {
      testId,
      answers: Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }),
      ),
    };

    try {
      const result = await api.post("/submissions", payload);

      if (result?.status === 201) {
        navigate(`/participant/classes/${classId}/tests/${testId}/result`);
      }
    } catch (err: unknown) {
      const message = getResponseMessage(err);

      console.error("Submit error:", message || err);

      // ================= HANDLE ALREADY SUBMITTED =================
      if (message === "Test already submitted") {
        navigate(`/participant/classes/${classId}/tests/${testId}/result`);
        return;
      }

      alert(message || "Something went wrong while submitting test.");
    }
  };

  if (questionsStatus === "loading") {
    return (
      <div className="mx-auto my-12 max-w-xl rounded-lg border border-gray-300 bg-white p-8 text-center">
        Loading test questions...
      </div>
    );
  }

  if (questionsStatus === "error") {
    return (
      <div
        className="mx-auto my-12 max-w-xl rounded-lg border border-gray-300 bg-white p-8 text-center"
        role="alert"
      >
        <h2>Unable to load this test</h2>
        <p>{questionsError}</p>
        <button
          className="mt-3 cursor-pointer rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
          onClick={() => void fetchQuestions()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (questionsStatus === "empty") {
    return (
      <div className="mx-auto my-12 max-w-xl rounded-lg border border-gray-300 bg-white p-8 text-center">
        <h2>This test has no questions yet</h2>
        <p>There are no questions available to answer at this time.</p>
        <button
          className="mt-3 cursor-pointer rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
          onClick={() => void fetchQuestions()}
        >
          Check again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <TestShell maxViolations={3} onForceSubmit={() => handleSubmit("auto")}>
      <div className="flex flex-col gap-5 lg:flex-row">

        {/* LEFT - QUESTION */}
        <div className="w-full lg:w-3/5">
          <p className="mb-4 text-lg font-medium">
            {currentQuestion.questionText}
          </p>

          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.optionId}
                className="flex cursor-pointer items-center gap-2.5 p-2"
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={answers[currentQuestion._id] === opt.optionId}
                  onChange={() =>
                    handleSelect(currentQuestion._id, opt.optionId)
                  }
                />
                {opt.contentValue}
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              className="rounded border border-[#1767AD] bg-white px-4 py-2 text-[#1767AD] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            <button
              className="rounded border border-[#1767AD] bg-white px-4 py-2 text-[#1767AD] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </button>

            <button
              className="rounded bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-4 py-2 text-white hover:brightness-110"
              onClick={() => handleSubmit("manual")}
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* RIGHT - NAVIGATOR */}
        <div className="w-full lg:w-2/5">
          <div className="mb-2.5">
            {detailsStatus === "loading" ? (
              <div>Loading timer...</div>
            ) : detailsStatus === "error" || duration === null ? (
              <div role="status">
                <div>Timer unavailable</div>
                <button
                  className="mt-3 cursor-pointer rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
                  onClick={() => void fetchTestMeta()}
                >
                  Retry timer
                </button>
              </div>
            ) : (
              <Timer
                duration={duration}
                onTimeUp={() => handleSubmit("auto")}
              />
            )}
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-4 gap-2">
            {questions.map((q, index) => {
              const isAnswered = !!answers[q._id];
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={q._id}
                  className={`cursor-pointer rounded p-2.5 text-center ${
                    isCurrent
                      ? "bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] text-white"
                      : isAnswered
                        ? "bg-green-300 text-black"
                        : "bg-slate-500 text-white"
                  }`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mx-auto mt-5 flex max-w-sm flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <p className="flex items-center whitespace-nowrap">
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-green-300"></span>
              Answered
            </p>
            <p className="flex items-center whitespace-nowrap">
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-slate-500"></span>
              Not Answered
            </p>
            <p className="flex items-center whitespace-nowrap">
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E]"></span>
              Current
            </p>
          </div>
        </div>
      </div>
    </TestShell>
  );
}
