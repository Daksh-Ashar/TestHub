import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/addquestion.css";
import { v4 as uuidv4 } from "uuid";
import type { Question, Option } from "../Types/question.type";

export default function AddQuestion() {
  const { testId, classId } = useParams();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([
    {
      optionId: uuidv4(),
      contentType: "text",
      contentValue: "",
      isCorrect: false,
    },
    {
      optionId: uuidv4(),
      contentType: "text",
      contentValue: "",
      isCorrect: false,
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  // ================================
  // OPTION HANDLERS
  // ================================

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        optionId: uuidv4(),
        contentType: "text",
        contentValue: "",
        isCorrect: false,
      },
    ]);
  };

  const handleDeleteOption = (id: string) => {
    setOptions(options.filter((opt) => opt.optionId !== id));
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((opt) =>
        opt.optionId === id ? { ...opt, contentValue: value } : opt,
      ),
    );
  };

  const handleCorrectChange = (id: string) => {
    setOptions(
      options.map((opt) => ({
        ...opt,
        isCorrect: opt.optionId === id,
      })),
    );
  };

  // ================================
  // SUBMIT QUESTION
  // ================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // ✅ Validation
  if (!questionText.trim()) {
    alert("Please enter question");
    return;
  }

  if (options.length < 2) {
    alert("At least 2 options required");
    return;
  }

  const hasEmptyOption = options.some(
    (opt) => !opt.contentValue.trim()
  );

  if (hasEmptyOption) {
    alert("All options must have text");
    return;
  }

  const hasCorrect = options.some((opt) => opt.isCorrect);

  if (!hasCorrect) {
    alert("Please select correct answer");
    return;
  }

  // ✅ API call
  const payload = {
    testId,
    questionText,
    options,
  };

  try {
    const res = await api.post<Question>("/questions", payload);

    setQuestions([...questions, res.data]);

    // reset
    setQuestionText("");
    setOptions([
      {
        optionId: uuidv4(),
        contentType: "text",
        contentValue: "",
        isCorrect: false,
      },
      {
        optionId: uuidv4(),
        contentType: "text",
        contentValue: "",
        isCorrect: false,
      },
    ]);
  } catch (err) {
    console.error(err);
  }
};

  // ================================
  // FETCH QUESTIONS
  // ================================

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get<Question[]>(`/questions/test/${testId}`);
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (testId) fetchQuestions();
  }, [testId]);

  // ================================
  // PUBLISH TEST
  // ================================

  const handlePublish = async () => {
    try {
      await api.patch(`/tests/${testId}/publish`);
      alert("Test Published");
      navigate(`/creator/classes/${classId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    {/* Toolbar */}
      <div className="toolbar">
        <button
          onClick={handlePublish}
          disabled={questions.length === 0}
          className="publish-btn"
        >
          Publish Test
        </button>
      </div>
    <div className="question-page">
      
      {/* LEFT */}
      <div className="question-form">
        <h3>Add Question</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              value={questionText}
              placeholder="Type your question here..."
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Options</label>

            {options.map((opt, index) => (
              <div key={opt.optionId} className="option-row">
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectChange(opt.optionId)}
                />

                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt.contentValue}
                  onChange={(e) =>
                    handleOptionChange(opt.optionId, e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => handleDeleteOption(opt.optionId)}
                >
                  Delete
                </button>
              </div>
            ))}

            <button type="button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>

          <button type="submit">Save Question</button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="question-list">
        <h3>Questions ({questions.length})</h3>

        {questions.map((q) => (
          <div key={q._id} className="question-item">
            <p className="question-text">{q.questionText}</p>

            <div className="options-list">
              {q.options.map((opt) => (
                <div
                  key={opt.optionId}
                  className={`option-item ${opt.isCorrect ? "correct" : ""}`}
                >
                  <span className="option-text">{opt.contentValue}</span>

                  {opt.isCorrect && <span className="correct-icon">✔</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
