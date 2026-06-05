import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import {
  useGetQuestionSolveDataQuery,
  useSubmitSolutionMutation,
  type QuestionSolveStatus,
} from "../store/api/challengesApi";

/** RTK Query `unwrap()` rejection shape from fetchBaseQuery. */
function isRtkFetchError(err: unknown): err is { status: number | string; data?: unknown } {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status !== "undefined"
  );
}

/** Extract user-facing message from submit failure (e.g. `{ "error": "Java compile failed: ..." }`). */
function getSubmitErrorMessage(err: unknown): string {
  if (isRtkFetchError(err)) {
    const data = err.data;
    if (data && typeof data === "object" && data !== null && "error" in data) {
      const msg = (data as { error: unknown }).error;
      if (typeof msg === "string" && msg.trim()) return msg;
    }
    if (typeof err.status === "number") {
      return `Request failed (${err.status})`;
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Try again.";
}

function normalizeSolveStatus(v: unknown): QuestionSolveStatus | null {
  if (v === null || v === undefined) return null;
  const s = String(v).toLowerCase();
  if (s === "completed") return "completed";
  if (s === "failed") return "failed";
  if (s === "pending") return "pending";
  return null;
}

function solveStatusPill(
  status: QuestionSolveStatus | null,
  isAnonymous: boolean,
): { label: string; className: string } {
  if (isAnonymous) {
    return {
      label: "Sign in",
      className: "bg-white/5 text-white/45 border-white/15",
    };
  }
  switch (status) {
    case "completed":
      return {
        label: "Solved",
        className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      };
    case "failed":
      return {
        label: "Failed",
        className: "bg-red-400/10 text-red-400 border-red-400/20",
      };
    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-400/10 text-amber-300 border-amber-400/25",
      };
    default:
      return {
        label: "—",
        className: "bg-white/5 text-white/40 border-white/10",
      };
  }
}

type CasePillStatus = "pending" | "pass" | "fail";

function pillStyles(status: CasePillStatus): { dot: string; ring: string } {
  switch (status) {
    case "pass":
      return {
        dot: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
        ring: "border-emerald-500/40",
      };
    case "fail":
      return {
        dot: "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.45)]",
        ring: "border-red-500/40",
      };
    default:
      return {
        dot: "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]",
        ring: "border-yellow-500/35",
      };
  }
}

function caseStatus(
  index: number,
  caseResults: boolean[] | null,
): CasePillStatus {
  if (caseResults === null) return "pending";
  const v = caseResults[index];
  if (v === undefined) return "pending";
  return v ? "pass" : "fail";
}

const Question: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const editorRef = useRef<{ getValue(): string } | null>(null);
  const { data: response, isLoading, error } = useGetQuestionSolveDataQuery(questionId!);
  const [submitSolution, { isLoading: isSubmitting }] = useSubmitSolutionMutation();
  const [caseResults, setCaseResults] = useState<boolean[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setCaseResults(null);
    setSubmitError(null);
  }, [questionId]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0f0f0f] text-white flex items-center justify-center font-bold tracking-[0.3em] uppercase opacity-50 animate-pulse">
        Initializing Workspace...
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0f0f0f] text-red-500 flex items-center justify-center font-bold tracking-[0.2em] uppercase">
        Failed to Load Challenge Environment
      </div>
    );
  }

  const questionData = response.data;
  const solveLanguage = questionData.language ?? "python";
  const monacoLanguage =
    solveLanguage === "cpp" ? "cpp" : solveLanguage === "java" ? "java" : "python";
  const languageLabel =
    solveLanguage === "cpp" ? "C++17" : solveLanguage === "java" ? "Java" : "Python 3";

  const publicTestCases = questionData.test_cases ?? [];
  const rawSolveStatus = questionData.solve_status;
  const solveStatusNormalized = normalizeSolveStatus(rawSolveStatus);
  const solveIsAnonymous = rawSolveStatus === null;
  const statusPill = solveStatusPill(solveStatusNormalized, solveIsAnonymous);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f0f0f] text-gray-200 flex flex-col font-sans selection:bg-blue-500/30">
      <div className="flex flex-row flex-1 min-h-0 min-w-0 w-full overflow-hidden relative items-stretch">
        {/* Background blobs for depth */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* LEFT PANEL - Description (45% width, fixed share of row) */}
        <aside className="box-border w-[45%] max-w-[45%] flex-[0_0_45%] min-w-0 min-h-0 flex flex-col p-8 overflow-y-auto scrollbar-hide border-r border-white/5 bg-[#141414]/50 backdrop-blur-sm z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border font-mono ${questionData.difficulty === "easy" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : questionData.difficulty === "medium" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"}`}
            >
              {questionData.difficulty}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border font-mono ${statusPill.className}`}
            >
              {statusPill.label}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
            {questionData.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-400 leading-relaxed whitespace-pre-line">
              {questionData.description}
            </p>
          </div>

          {questionData.image_url && (
            <div className="mt-8">
              <img
                src={questionData.image_url}
                alt={`${questionData.title} reference`}
                className="max-h-[420px] w-full object-contain rounded-2xl border border-white/10 bg-black/30"
                loading="lazy"
              />
            </div>
          )}

          {/* Examples section */}
          <div className="mt-12 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              Test Scenarios
            </h2>

            {questionData.test_cases.filter((tc) => !tc.is_hidden).map((test, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-[#1a1a1a] rounded-xl p-6 border border-white/5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input Data</p>
                    <code className="text-blue-400 font-mono text-sm block bg-black/30 p-2 rounded-lg">
                      {questionData.parameters.map((p, i) => `${p.name} = ${JSON.stringify(test.input_data[i])}`).join(", ")}
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected Result</p>
                    <code className="text-green-400 font-mono text-sm block bg-black/30 p-2 rounded-lg">
                      {JSON.stringify(test.expected_output)}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {questionData.constraints && (
            <div className="mt-12 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-sm text-indigo-300 font-medium">Mission Constraints:</p>
              <div className="mt-2 text-xs text-gray-500 space-y-1 whitespace-pre-line">
                {questionData.constraints}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT PANEL - Editor (~55% — remainder of row; bottom bar fixed at left-[45%]) */}
        <main className="box-border flex-1 min-w-0 min-h-0 flex flex-col z-10 pb-[4.5rem]">
          <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a] border-b border-white/5 shrink-0">
            <div className="flex gap-4">
              <span className="text-xs font-bold text-blue-400 py-2 border-b-2 border-blue-400 uppercase tracking-widest">
                {languageLabel}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 bg-[#1e1e1e]">
            <Editor
              key={`${questionId}-${solveLanguage}`}
              height="100%"
              defaultLanguage={monacoLanguage}
              theme="vs-dark"
              defaultValue={questionData.starter_code}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 15,
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 20 },
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                lineNumbers: "on",
                cursorStyle: "line",
                smoothScrolling: true,
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },
              }}
            />
          </div>
        </main>
      </div>

      {/* Docked to solution column only — public test case pills + submit + errors */}
      <div className="fixed bottom-0 left-[45%] right-0 z-[100] flex flex-col bg-[#111]/95 backdrop-blur-md border-t border-l border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.45)]">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap justify-start gap-3 min-w-0 flex-1">
            {publicTestCases.length === 0 ? (
              <span className="text-xs text-white/40 uppercase tracking-widest">No public cases</span>
            ) : (
              publicTestCases.map((_, index) => {
                const st = caseStatus(index, caseResults);
                const { dot, ring } = pillStyles(st);
                return (
                  <div
                    key={index}
                    className={`flex gap-2 justify-center items-center border bg-[#2a2a2a] px-3 py-1.5 rounded-full text-sm text-white/90 border-[#464646] ${ring}`}
                  >
                    <div className={`w-5 h-5 rounded-full border border-white/20 shrink-0 ${dot}`} />
                    <span className="whitespace-nowrap">Case {index + 1}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={async () => {
                if (!questionId) return;
                setSubmitError(null);
                const code = editorRef.current?.getValue() ?? "";
                try {
                  const result = await submitSolution({
                    question_id: String(questionId),
                    code,
                    language: solveLanguage,
                  }).unwrap();
                  setSubmitError(null);
                  setCaseResults(result.case_results ?? []);
                } catch (e) {
                  console.error("Submit failed", e);
                  setSubmitError(getSubmitErrorMessage(e));
                }
              }}
              disabled={isSubmitting || !questionId}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
        {submitError ? (
          <div
            role="alert"
            className="border-t border-red-500/25 bg-red-950/50 px-6 py-3 text-left text-sm text-red-200/95 font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto"
          >
            {submitError}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Question;
