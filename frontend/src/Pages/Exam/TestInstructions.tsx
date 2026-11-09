import { useNavigate, useParams } from "react-router-dom";

export default function TestInstructions() {
  const { testId, classId } = useParams();
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
        const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed", err);
    }
      navigate(`/participant/classes/${classId}/tests/${testId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start test.");
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 md:flex-row">
      {/* ================= LEFT CONTENT ================= */}
      <div className="max-h-[90vh] flex-[2] overflow-y-auto pr-2.5">
        <h1 className="mb-4 text-2xl font-semibold">Test Instructions</h1>

        <section className="mb-4 rounded-lg border-l-[5px] border-[#4a90e2] bg-[#f9f9f9] p-4">
          <h2 className="mb-2 text-lg font-semibold">📘 General Instructions</h2>
          <ul className="list-disc space-y-1 pl-8">
            <li>Read all questions carefully.</li>
            <li>Use Next/Previous for navigation.</li>
            <li>Answers are saved automatically.</li>
          </ul>
        </section>

        <section className="mb-4 rounded-lg border-l-[5px] border-[#4a90e2] bg-[#f9f9f9] p-4">
          <h2 className="mb-2 text-lg font-semibold">🎯 Question Colors</h2>
          <div className="space-y-1 pl-4">
            <p>
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-green-300"></span>
              Answered Question
            </p>
            <p>
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-slate-500"></span>
              Not Answered Question
            </p>
            <p>
              <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E]"></span>
              Current Question
            </p>
          </div>
        </section>

        <section className="mb-4 rounded-lg border-l-[5px] border-orange-500 bg-[#f9f9f9] p-4">
          <h2 className="mb-2 text-lg font-semibold">⚠ Fullscreen Rule</h2>
          <ul className="list-disc space-y-1 pl-8">
            <li>Test runs in fullscreen mode.</li>
            <li>Exiting fullscreen is a violation.</li>
          </ul>
        </section>

        <section className="mb-4 rounded-lg border-l-[5px] border-red-600 bg-[#f9f9f9] p-4">
          <h2 className="mb-2 text-lg font-semibold">🚨 Tab Switch Rule</h2>
          <ul className="list-disc space-y-1 pl-8">
            <li>Tab switching is tracked.</li>
            <li>Multiple violations may auto-submit test.</li>
          </ul>
        </section>
      </div>

      {/* ================= RIGHT FIXED ACTION PANEL ================= */}
      <div className="h-fit flex-1 md:sticky md:top-5">
        <div className="rounded-[10px] border-2 border-[#4a90e2] bg-white p-5 text-center">
          <h3 className="mb-2 text-lg font-semibold">Ready to start?</h3>
          <p className="mb-2">
            Make sure you are in a quiet environment before starting the test.
          </p>

          <button
            onClick={handleStartTest}
            className="mt-2 w-full cursor-pointer rounded-md bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] p-3 font-medium text-white hover:brightness-110"
          >
            Start Test
          </button>

          <small className="mt-3 block">
            ⚠ Once started, timer and monitoring will begin.
          </small>
        </div>
      </div>
    </div>
  );
}
