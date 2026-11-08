import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/takeTest.css";
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
      console.error("Test details request failed:", err);
      setDetailsStatus("error");
    }
  }, [duration, testId]);

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
      console.error("Questions request failed:", err);
      setQuestionsError("We couldn't load the questions for this test.");
      setQuestionsStatus("error");
    }
  }, [testId]);

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
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : undefined;

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
    return <div className="test-status">Loading test questions...</div>;
  }

  if (questionsStatus === "error") {
    return (
      <div className="test-status" role="alert">
        <h2>Unable to load this test</h2>
        <p>{questionsError}</p>
        <button onClick={() => void fetchQuestions()}>Retry</button>
      </div>
    );
  }

  if (questionsStatus === "empty") {
    return (
      <div className="test-status">
        <h2>This test has no questions yet</h2>
        <p>There are no questions available to answer at this time.</p>
        <button onClick={() => void fetchQuestions()}>Check again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <TestShell maxViolations={3} onForceSubmit={() => handleSubmit("auto")}>
      <div className="test-container">

        {/* LEFT - QUESTION */}
        <div className="question-panel">
          <h3>
            Question {currentIndex + 1} / {questions.length}
          </h3>

          <p className="question-text">{currentQuestion.questionText}</p>

          <div className="options">
            {currentQuestion.options.map((opt) => (
              <label key={opt.optionId} className="option">
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
          <div className="nav-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </button>

            <button onClick={() => handleSubmit("manual")}>Submit Test</button>
          </div>
        </div>

        {/* RIGHT - NAVIGATOR */}
        <div className="navigator">
        
        <div style={{ marginBottom: "10px" }}>
          {detailsStatus === "loading" ? (
            <div>Loading timer...</div>
          ) : detailsStatus === "error" || duration === null ? (
            <div role="status">
              <div>Timer unavailable</div>
              <button onClick={() => void fetchTestMeta()}>Retry timer</button>
            </div>
          ) : (
            <Timer duration={duration} onTimeUp={() => handleSubmit("auto")} />
          )}
        </div>
        
          <h4>Questions</h4>

          <div className="grid">
            {questions.map((q, index) => {
              const isAnswered = !!answers[q._id];
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={q._id}
                  className={`tile 
                  ${isAnswered ? "answered" : "unanswered"} 
                  ${isCurrent ? "current" : ""}
                `}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="legend">
            <p>
              <span className="box green"></span> Answered
            </p>
            <p>
              <span className="box orange"></span> Not Answered
            </p>
            <p>
              <span className="box blue"></span> Current
            </p>
          </div>
        </div>
      </div>
    </TestShell>
  );
}
