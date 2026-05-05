import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    useCreateQuestionMutation,
    useGetQuestionByIdQuery,
    useUpdateQuestionMutation,
} from "../../store/api/challengesApi";
import type {
    QuestionData,
    QuestionParameter,
    TestCase,
    TypeSchema,
    TypeKind,
    PrimitiveName,
} from "../../store/api/challengesApi";
import { Plus, Trash2, ChevronRight, Settings, Pencil } from "lucide-react";

function getSaveErrorMessage(err: unknown): string {
    const e = err as { status?: number; data?: { message?: string; error?: unknown } };
    if (e?.status === 401) return "Unauthorized. Please sign in again.";
    if (e?.status === 403) return "Forbidden. This action requires a staff/admin account.";
    if (typeof e?.data?.message === "string" && e.data.message.trim()) return e.data.message;
    if (Array.isArray(e?.data?.error) && e.data.error.length > 0) {
        return e.data.error.join(", ");
    }
    return "Failed to publish challenge.";
}

function formatValueForForm(v: unknown): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    try {
        return JSON.stringify(v);
    } catch {
        return String(v);
    }
}

// --- Recursive Type Selector Component ---
interface TypeSelectorProps {
    value: TypeSchema;
    onChange: (value: TypeSchema) => void;
    label?: string;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onChange, label }) => {
    const kinds: TypeKind[] = ["primitive", "array", "map"];
    const primitives: PrimitiveName[] = ["int", "bool", "string"];

    const handleKindChange = (kind: TypeKind) => {
        const newVal: TypeSchema = { kind };
        if (kind === "primitive") newVal.name = "int";
        if (kind === "array") newVal.of = { kind: "primitive", name: "int" };
        if (kind === "map") {
            newVal.key = { kind: "primitive", name: "string" };
            newVal.value = { kind: "primitive", name: "int" };
        }
        onChange(newVal);
    };

    return (
        <div className="space-y-3 p-4 bg-gray-900/30 border border-gray-800/50 rounded-xl">
            {label && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>}
            <div className="flex gap-2">
                {kinds.map((k) => (
                    <button
                        key={k}
                        type="button"
                        onClick={() => handleKindChange(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${value.kind === k ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}
                    >
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                    </button>
                ))}
            </div>

            <div className="pl-2 border-l border-gray-800/50 space-y-3">
                {value.kind === "primitive" && (
                    <select
                        value={value.name}
                        onChange={(e) => onChange({ ...value, name: e.target.value as PrimitiveName })}
                        className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500/50 transition"
                    >
                        {primitives.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                )}

                {value.kind === "array" && value.of && (
                    <TypeSelector label="Elements of" value={value.of} onChange={(of) => onChange({ ...value, of })} />
                )}

                {value.kind === "map" && value.key && value.value && (
                    <div className="space-y-3">
                        <TypeSelector label="Keys" value={value.key} onChange={(key) => onChange({ ...value, key })} />
                        <TypeSelector label="Values" value={value.value} onChange={(v) => onChange({ ...value, value: v })} />
                    </div>
                )}
            </div>
        </div>
    );
};

export interface AddQuestionProps {
    /** When set, form loads this question and PATCHes on submit. */
    editQuestionId?: string;
}

// --- Main AddQuestion Component ---
const AddQuestion: React.FC<AddQuestionProps> = ({ editQuestionId }) => {
    const navigate = useNavigate();
    const isEdit = Boolean(editQuestionId);

    const loadedIdRef = useRef<string | null>(null);

    const {
        data: existingQuestion,
        isLoading: isLoadingQuestion,
        isError: isLoadError,
        error: loadError,
    } = useGetQuestionByIdQuery(editQuestionId!, { skip: !editQuestionId });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [constraints, setConstraints] = useState("");
    const [functionName, setFunctionName] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
    const [returnType, setReturnType] = useState<TypeSchema>({ kind: "primitive", name: "int" });

    const [parameters, setParameters] = useState<QuestionParameter[]>([
        { name: "", order: 1, type_schema: { kind: "primitive", name: "int" } }
    ]);

    const [testCases, setTestCases] = useState<TestCase[]>([
        { input_data: [], expected_output: "", is_hidden: false }
    ]);

    const [createQuestion, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError }] =
        useCreateQuestionMutation();
    const [updateQuestion, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] =
        useUpdateQuestionMutation();

    const isLoading = isCreating || isUpdating;
    const isSuccess = isEdit ? isUpdateSuccess : isCreateSuccess;
    const isError = isEdit ? isUpdateError : isCreateError;
    const error = isEdit ? updateError : createError;

    useEffect(() => {
        loadedIdRef.current = null;
    }, [editQuestionId]);

    useEffect(() => {
        if (!editQuestionId || !existingQuestion) return;
        if (String(existingQuestion.id) !== String(editQuestionId)) return;
        if (loadedIdRef.current === editQuestionId) return;
        loadedIdRef.current = editQuestionId;

        const q = existingQuestion;
        setTitle(q.title);
        setDescription(q.description);
        setImageFile(null);
        setImagePreview(q.image_url ?? "");
        setConstraints(q.constraints ?? "");
        setFunctionName(q.function_name);
        setDifficulty(q.difficulty);
        setReturnType(q.return_type);

        const params = q.parameters?.length
            ? q.parameters.map((p, i) => ({ ...p, order: p.order ?? i + 1 }))
            : [{ name: "", order: 1, type_schema: { kind: "primitive" as const, name: "int" as const } }];
        setParameters(params);

        const tcList =
            q.test_cases?.length > 0
                ? q.test_cases.map((tc) => ({
                      input_data: params.map((_, i) => formatValueForForm(tc.input_data?.[i])),
                      expected_output: formatValueForForm(tc.expected_output),
                      is_hidden: tc.is_hidden,
                  }))
                : [{ input_data: params.map(() => ""), expected_output: "", is_hidden: false }];
        setTestCases(tcList);
    }, [editQuestionId, existingQuestion]);

    const addParameter = () => {
        setParameters([...parameters, { name: "", order: parameters.length + 1, type_schema: { kind: "primitive", name: "int" } }]);
    };

    const removeParameter = (index: number) => {
        setParameters(parameters.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i + 1 })));
    };

    const updateParameter = (index: number, updates: Partial<QuestionParameter>) => {
        const newParams = [...parameters];
        newParams[index] = { ...newParams[index], ...updates };
        setParameters(newParams);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input_data: parameters.map(() => ""), expected_output: "", is_hidden: false }]);
    };

    const removeTestCase = (index: number) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const updateTestCase = (caseIndex: number, updates: Partial<TestCase>) => {
        const newTestCases = [...testCases];
        newTestCases[caseIndex] = { ...newTestCases[caseIndex], ...updates };
        setTestCases(newTestCases);
    };

    const updateTestCaseInput = (caseIndex: number, inputIndex: number, value: string) => {
        const newTestCases = [...testCases];
        const inputs = [...newTestCases[caseIndex].input_data];
        inputs[inputIndex] = value;
        newTestCases[caseIndex].input_data = inputs;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Parse inputs/outputs as JSON if they look like it
            const parseValue = (val: string) => {
                const trimmed = val.trim();
                if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
                    try { return JSON.parse(trimmed); } catch { return trimmed; }
                }
                if (trimmed === "true") return true;
                if (trimmed === "false") return false;
                if (!isNaN(Number(trimmed)) && trimmed !== "") return Number(trimmed);
                return trimmed;
            };

            const payload = {
                title,
                description,
                constraints,
                function_name: functionName,
                difficulty,
                return_type: returnType,
                parameters,
                test_cases: testCases.map(tc => ({
                    ...tc,
                    input_data: tc.input_data.map(i => typeof i === 'string' ? parseValue(i) : i),
                    expected_output: typeof tc.expected_output === 'string' ? parseValue(tc.expected_output) : tc.expected_output
                }))
            };

            const formData = new FormData();
            formData.append("title", payload.title);
            formData.append("description", payload.description);
            formData.append("constraints", payload.constraints);
            formData.append("function_name", payload.function_name);
            formData.append("difficulty", payload.difficulty);
            formData.append("return_type", JSON.stringify(payload.return_type));
            formData.append("parameters", JSON.stringify(payload.parameters));
            formData.append("test_cases", JSON.stringify(payload.test_cases));
            if (imageFile) {
                formData.append("image", imageFile);
            }

            if (isEdit && editQuestionId) {
                await updateQuestion({
                    id: editQuestionId,
                    body: formData,
                }).unwrap();
            } else {
                await createQuestion(formData).unwrap();
                setTitle("");
                setDescription("");
                setImageFile(null);
                setImagePreview("");
                setConstraints("");
                setFunctionName("");
                setParameters([{ name: "", order: 1, type_schema: { kind: "primitive", name: "int" } }]);
                setTestCases([{ input_data: [], expected_output: "", is_hidden: false }]);
            }
        } catch (err) {
            console.error("Failed to save: ", err);
        }
    };

    if (isEdit && isLoadingQuestion) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400 animate-pulse">
                Loading question…
            </div>
        );
    }

    if (isEdit && (isLoadError || !existingQuestion)) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300">
                    <p className="font-bold mb-2">Could not load question</p>
                    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-48">
                        {JSON.stringify((loadError as { data?: unknown })?.data ?? loadError, null, 2)}
                    </pre>
                    <Link
                        to="/admin"
                        className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                        ← Back to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
            <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                            {isEdit ? (
                                <Pencil className="w-6 h-6 text-blue-500" />
                            ) : (
                                <Plus className="w-6 h-6 text-blue-500" />
                            )}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {isEdit ? "Refine challenge" : "Forge a Challenge"}
                        </h1>
                    </div>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="text-sm font-bold text-gray-500 hover:text-white transition uppercase tracking-widest"
                        >
                            ← Dashboard
                        </button>
                    )}
                </div>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    {isEdit
                        ? "Update structured parameters and validation cases for this problem."
                        : "Design intricate problems with structured parameters and validated test cases."}
                </p>
            </header>

            {isSuccess && (
                <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <p className="text-green-400 font-medium">
                        {isEdit ? "Challenge updated successfully." : "Challenge published to the arena successfully!"}
                    </p>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="sm:ml-auto px-4 py-2 rounded-xl bg-green-500/20 text-green-300 text-sm font-bold hover:bg-green-500/30 transition"
                        >
                            Back to list
                        </button>
                    )}
                </div>
            )}

            {isError && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 animate-in shake-in">
                    <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <p className="text-red-400 font-bold mb-1">Failed to publish</p>
                        <p className="text-sm text-red-300/90 mb-2">
                            {getSaveErrorMessage(error)}
                        </p>
                        <pre className="text-xs text-red-300/70 whitespace-pre-wrap">
                            {JSON.stringify((error as any)?.data || error, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 space-y-10">
                    {/* Section 1: Core Definitions */}
                    <section className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-black/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Settings className="w-32 h-32" />
                            </div>

                            <div className="flex items-center gap-2 mb-8 text-blue-400 font-bold tracking-widest text-xs uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Core Definitions
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-8 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="e.g. Spiral Matrix"
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/[0.08]"
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value as any)}
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-6 py-4 text-white outline-none transition-all duration-300 appearance-none capitalize cursor-pointer hover:bg-white/[0.08]"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div className="md:col-span-12 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={5}
                                        placeholder="Detailed problem explanation..."
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/[0.08] resize-none"
                                    />
                                </div>

                                <div className="md:col-span-12 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Question Image (Optional Upload)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0] || null;
                                            setImageFile(f);
                                            if (f) {
                                                setImagePreview(URL.createObjectURL(f));
                                            }
                                        }}
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-6 py-4 text-white outline-none transition-all duration-300 hover:bg-white/[0.08]"
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Question preview"
                                            className="mt-3 max-h-56 rounded-xl border border-white/10 bg-black/20 object-contain"
                                        />
                                    )}
                                </div>

                                <div className="md:col-span-12 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Constraints (Optional)</label>
                                    <input
                                        value={constraints}
                                        onChange={(e) => setConstraints(e.target.value)}
                                        placeholder="e.g. 1 <= nums.length <= 10^3"
                                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/[0.08]"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Technical Signature */}
                    <section className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 lg:p-10">
                        <div className="flex items-center gap-2 mb-10 text-purple-400 font-bold tracking-widest text-xs uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Technical Signature
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left: Metadata */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Function Name</label>
                                    <input
                                        value={functionName}
                                        onChange={(e) => setFunctionName(e.target.value)}
                                        required
                                        placeholder="e.g. solve"
                                        className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none transition-all duration-300"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Return Type</label>
                                    <TypeSelector value={returnType} onChange={setReturnType} />
                                </div>
                            </div>

                            {/* Right: Parameters */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Parameters</label>
                                    <button
                                        type="button"
                                        onClick={addParameter}
                                        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-[10px] font-bold uppercase transition"
                                    >
                                        <Plus className="w-3 h-3" /> Add Parameter
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {parameters.map((param, index) => (
                                        <div key={index} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4 group/param relative">
                                            <button
                                                type="button"
                                                onClick={() => removeParameter(index)}
                                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition opacity-0 group-hover/param:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Argument #{index + 1} Name</label>
                                                <input
                                                    value={param.name}
                                                    onChange={(e) => updateParameter(index, { name: e.target.value })}
                                                    placeholder="VariableName"
                                                    className="w-full bg-black/40 border border-white/5 focus:border-blue-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 outline-none transition"
                                                />
                                            </div>
                                            <TypeSelector
                                                value={param.type_schema}
                                                onChange={(ts) => updateParameter(index, { type_schema: ts })}
                                                label="Type Schema"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Test Suite */}
                    <section className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 lg:p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-2 text-green-400 font-bold tracking-widest text-xs uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Validation Suite
                            </div>
                            <button
                                type="button"
                                onClick={addTestCase}
                                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold transition flex items-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Case
                            </button>
                        </div>

                        <div className="space-y-8">
                            {testCases.map((tc, caseIndex) => (
                                <div key={caseIndex} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative group/case">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Deployment Case {caseIndex + 1}</span>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                                <span className="text-[10px] font-bold text-gray-500 group-hover/toggle:text-gray-300 transition uppercase tracking-widest">Hidden</span>
                                                <div
                                                    onClick={() => updateTestCase(caseIndex, { is_hidden: !tc.is_hidden })}
                                                    className={`w-10 h-5 rounded-full transition-all duration-300 relative ${tc.is_hidden ? 'bg-blue-600' : 'bg-gray-800'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${tc.is_hidden ? 'left-6' : 'left-1'}`} />
                                                </div>
                                            </label>
                                            {testCases.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTestCase(caseIndex)}
                                                    className="text-gray-600 hover:text-red-500 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Inputs</p>
                                            {parameters.map((param, paramIndex) => (
                                                <div key={paramIndex} className="space-y-2">
                                                    <label className="text-[10px] text-gray-600 flex items-center gap-2">
                                                        <ChevronRight className="w-2.5 h-2.5" />
                                                        {param.name || `Argument ${paramIndex + 1}`}
                                                    </label>
                                                    <input
                                                        value={tc.input_data[paramIndex] || ""}
                                                        onChange={(e) => updateTestCaseInput(caseIndex, paramIndex, e.target.value)}
                                                        placeholder="Value..."
                                                        className="w-full bg-black/40 border border-white/5 focus:border-blue-500/30 rounded-xl px-5 py-3 text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Expected Result</p>
                                            <textarea
                                                value={tc.expected_output}
                                                onChange={(e) => updateTestCase(caseIndex, { expected_output: e.target.value })}
                                                rows={Math.max(4, parameters.length * 2)}
                                                placeholder="Resulting value..."
                                                className="w-full bg-black/40 border border-white/5 focus:border-green-500/30 rounded-2xl px-5 py-3 text-sm resize-none h-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full h-20 overflow-hidden rounded-3xl bg-blue-600 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(37,99,235,0.8)] disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center gap-3">
                                <Plus className={`w-6 h-6 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-90'}`} />
                                <span className="text-xl font-black uppercase tracking-widest text-white">
                                    {isLoading
                                        ? isEdit
                                            ? "Saving…"
                                            : "Publishing to Arena..."
                                        : isEdit
                                          ? "Save changes"
                                          : "Publish Challenge"}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddQuestion;
