import React, { useState } from "react";
import { useCreateQuestionMutation } from "../../store/api/challengesApi";
import type { QuestionParameter, TestCase } from "../../store/api/challengesApi";

const AddQuestion: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [functionName, setFunctionName] = useState("");
    const [returnType, setReturnType] = useState("int");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");

    const [parameters, setParameters] = useState<QuestionParameter[]>([
        { name: "", type: "int" }
    ]);

    const [testCases, setTestCases] = useState<TestCase[]>([
        { input: [{ name: "", value: "" }], output: "" }
    ]);

    const [createQuestion, { isLoading, isSuccess, isError, error }] = useCreateQuestionMutation();

    const addParameter = () => {
        setParameters([...parameters, { name: "", type: "int" }]);
    };

    const removeParameter = (index: number) => {
        setParameters(parameters.filter((_, i) => i !== index));
    };

    const updateParameter = (index: number, field: keyof QuestionParameter, value: string) => {
        const newParams = [...parameters];
        newParams[index][field] = value;
        setParameters(newParams);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: parameters.map(p => ({ name: p.name, value: "" })), output: "" }]);
    };

    const removeTestCase = (index: number) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const updateTestCaseInput = (caseIndex: number, inputIndex: number, value: any) => {
        const newTestCases = [...testCases];
        newTestCases[caseIndex].input[inputIndex].value = value;
        setTestCases(newTestCases);
    };

    const updateTestCaseOutput = (caseIndex: number, value: any) => {
        const newTestCases = [...testCases];
        newTestCases[caseIndex].output = value;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Basic client-side parsing of values if they look like JSON
            const formattedTestCases = testCases.map(tc => ({
                ...tc,
                input: tc.input.map((input, paramIndex) => ({
                    name: parameters[paramIndex]?.name || input.name,
                    value: typeof input.value === 'string' && (input.value.startsWith('[') || input.value.startsWith('{')) ? JSON.parse(input.value) : input.value
                })),
                output: typeof tc.output === 'string' && (tc.output.startsWith('[') || tc.output.startsWith('{')) ? JSON.parse(tc.output) : tc.output
            }));

            await createQuestion({
                title,
                description,
                function_name: functionName,
                parameters,
                return_type: returnType,
                test_cases: formattedTestCases,
                difficulty
            }).unwrap();

            // Reset form on success
            setTitle("");
            setDescription("");
            setFunctionName("");
            setParameters([{ name: "", type: "int" }]);
            setTestCases([{ input: [{ name: "", value: "" }], output: "" }]);
        } catch (err) {
            console.error("Failed to save the question: ", err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-bold mb-2">Create New Challenge</h1>
                <p className="text-gray-400">Define the rules, parameters, and test cases for the arena.</p>
            </header>

            {isSuccess && <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-200 rounded-xl">Question created successfully!</div>}
            {isError && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">Error: {(error as any)?.data?.message || "Failed to create question"}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-black/40 border border-blue-900/20 rounded-2xl p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} required type="text" placeholder="e.g. Spiral Matrix" className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition appearance-none capitalize">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Describe the problem..." className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition" />
                    </div>
                </section>

                {/* Function Signature */}
                <section className="bg-black/40 border border-blue-900/20 rounded-2xl p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-blue-400">Function Signature</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Function Name</label>
                            <input value={functionName} onChange={e => setFunctionName(e.target.value)} required type="text" placeholder="e.g. solve" className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Return Type</label>
                            <input value={returnType} onChange={e => setReturnType(e.target.value)} required type="text" placeholder="e.g. list(int)" className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Parameters</label>
                            <button type="button" onClick={addParameter} className="text-blue-500 hover:text-blue-400 text-sm font-bold">+ Add Param</button>
                        </div>
                        {parameters.map((param, index) => (
                            <div key={index} className="flex gap-4">
                                <input value={param.name} onChange={e => updateParameter(index, "name", e.target.value)} placeholder="Name" required className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 outline-none" />
                                <input value={param.type} onChange={e => updateParameter(index, "type", e.target.value)} placeholder="Type" required className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 outline-none" />
                                {parameters.length > 1 && <button type="button" onClick={() => removeParameter(index)} className="text-red-500 px-2 group-hover:scale-110 transition">×</button>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Test Cases */}
                <section className="bg-black/40 border border-blue-900/20 rounded-2xl p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-blue-400">Test Cases</h2>
                        <button type="button" onClick={addTestCase} className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600/30 transition">+ Add Case</button>
                    </div>

                    <div className="space-y-6">
                        {testCases.map((tc, caseIndex) => (
                            <div key={caseIndex} className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl relative group">
                                {testCases.length > 1 && <button type="button" onClick={() => removeTestCase(caseIndex)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">Remove</button>}
                                <p className="text-xs font-bold text-gray-600 mb-4 uppercase">Case #{caseIndex + 1}</p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inputs</p>
                                            {parameters.map((param, paramIndex) => (
                                                <div key={paramIndex} className="space-y-1">
                                                    <label className="text-xs text-gray-400">{param.name || `Param ${paramIndex + 1}`}</label>
                                                    <input
                                                        value={tc.input[paramIndex]?.value || ""}
                                                        onChange={e => updateTestCaseInput(caseIndex, paramIndex, e.target.value)}
                                                        placeholder="Value (or JSON)"
                                                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2 outline-none focus:border-blue-500/50"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Expected Output</p>
                                            <textarea
                                                value={tc.output}
                                                onChange={e => updateTestCaseOutput(caseIndex, e.target.value)}
                                                rows={Math.max(2, parameters.length * 2)}
                                                placeholder="Value (or JSON)"
                                                className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2 outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-xl font-bold transition shadow-2xl shadow-blue-900/40 disabled:opacity-50"
                    >
                        {isLoading ? "Saving Question..." : "Publish Question to Arena"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddQuestion;
