import { useEffect, useState } from "react";
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

export default function TakeTest() {
  const { testId, classId } = useParams<{ testId: string; classId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const state = location.state as { duration?: number };

  const [duration, setDuration] = useState<number | null>(
    state?.duration ?? null,
  );
  const navigate = useNavigate();

  // ================= SHUFFLE UTILS =================
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

  // ================= FETCH Timer =================

  useEffect(() => {
    if (duration === null && testId) {
      const fetchTestMeta = async () => {
        try {
          const res = await api.get(`/tests/${testId}/info`);
          setDuration(res.data.duration * 60);
        } catch (err) {
          console.error(err);
        }
      };

      fetchTestMeta();
    }
  }, [duration, testId]);

  // ================= FETCH QUESTIONS =================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get<Question[]>(`/questions/test/${testId}`);

        const finalQuestions = processQuestions(
          res.data,
          testConfig.shuffleQuestions,
          testConfig.shuffleOptions,
        );

        setQuestions(finalQuestions);
      } catch (err) {
        console.error(err);
      }
    };

    if (testId) fetchQuestions();
  }, [testId]);

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
    } catch (err: any) {
      const message = err?.response?.data?.message;

      console.error("Submit error:", message || err);

      // ================= HANDLE ALREADY SUBMITTED =================
      if (message === "Test already submitted") {
        navigate(`/participant/classes/${classId}/tests/${testId}/result`);
        return;
      }

      alert(message || "Something went wrong while submitting test.");
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

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
          {duration === null ? (
            <div>Loading timer...</div>
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
