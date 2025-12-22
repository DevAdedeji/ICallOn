"use client";
import { Check, X, ArrowRight } from "lucide-react";
import { Player, Round, Answer } from "@/src/db/schema";
import { fetchRoundAnswers, confirmRoundAnswers } from "@/src/actions/answers";
import { endRound } from "@/src/actions/rounds";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function ReviewAnswers({ round, player }: { round: Round, player?: Player }) {

    const playerId = player?.id
    const [answers, setAnswers] = useState<Answer[]>([])
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const loadAnswers = async () => {
            if (!round.id) return

            setIsFetching(true)
            await new Promise(resolve => setTimeout(resolve, 2000))
            try {
                const result = await fetchRoundAnswers(round.id)
                if (result.success && result.answers) {
                    setAnswers(result.answers)
                }
            } catch (error) {
                console.error('Failed to load answers:', error)
            } finally {
                setIsFetching(false)
            }
        }

        loadAnswers()
    }, [round.id])

    const POINTS_PER_ANSWER = 10;

    const calculatePoints = (answer: Answer) => {
        let points = 0;
        if (answer.name_valid) points += POINTS_PER_ANSWER;
        if (answer.animal_valid) points += POINTS_PER_ANSWER;
        if (answer.place_valid) points += POINTS_PER_ANSWER;
        if (answer.thing_valid) points += POINTS_PER_ANSWER;
        return points;
    };

    const markAsValid = (
        answerId: string,
        category: "name" | "animal" | "place" | "thing",
        valid: boolean
    ) => {
        setAnswers(prev =>
            prev.map(answer => {
                if (answer.id !== answerId) return answer;

                const updated = {
                    ...answer,
                    ...(category === "name" && { name_valid: valid }),
                    ...(category === "animal" && { animal_valid: valid }),
                    ...(category === "place" && { place_valid: valid }),
                    ...(category === "thing" && { thing_valid: valid }),
                };

                return {
                    ...updated,
                    points_earned: calculatePoints(updated),
                };
            })
        );
    };

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!answers) return
        try {
            setLoading(true);

            const validatedAnswers = answers.map(answer => ({
                ...answer,
                name_valid: answer.name_valid ?? false,
                animal_valid: answer.animal_valid ?? false,
                place_valid: answer.place_valid ?? false,
                thing_valid: answer.thing_valid ?? false,
            }));

            await confirmRoundAnswers(validatedAnswers);
            await endRound(round.id);

        } catch (error) {
            console.error(error);
            alert("Failed to confirm round");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-8 overflow-hidden">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white tracking-tight text-3xl md:text-4xl font-extrabold leading-tight">Review Answers</h1>
                    <p className="text-text-secondary text-base font-normal max-w-2xl">Validate player answers to finalize scoring. Click checkmarks to approve or crosses to reject. Use bulk actions for speed.</p>
                </div>
            </div>
            {/* Desktop view */}
            <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-border-dark bg-surface-dark/50 shadow-2xl">
                <table className="min-w-250 border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-20 bg-[#1e271c] border-b border-r border-border-dark p-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-left">
                                Players
                            </th>
                            <th className="border-b border-r border-border-dark bg-[#1e271c] p-4 text-left">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Name</h3>

                                        </div>

                                    </div>

                                </div>
                            </th>
                            <th className="border-b border-r border-border-dark bg-[#1e271c] p-4 text-left">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Animal</h3>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th className="border-b border-r border-border-dark bg-[#1e271c] p-4 text-left">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Place</h3>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th className="border-b border-r border-border-dark bg-[#1e271c] p-4 text-left">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Thing</h3>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th className="sticky right-0 z-20 border-b border-l border-border-dark bg-[#1e271c] p-4 text-center shadow-[-4px_0_12px_rgba(0,0,0,0.5)] text-xs font-bold text-text-secondary uppercase tracking-widest">
                                Total Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isFetching ? (
                                <tr>
                                    <td colSpan={6} className="p-12">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <p className="text-gray-400 font-semibold">Loading answers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : answers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <p className="text-gray-400">No answers submitted yet</p>
                                    </td>
                                </tr>
                            ) : (
                                answers.map((answer) => (
                                    <tr key={answer.id} className="bg-[#131811] border-b border-border-dark">
                                        <td className="sticky left-0 z-10 p-4 flex items-center gap-3 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">{answer.player_name}</span>
                                                {playerId === answer.player_id && <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded w-fit mt-1">You</span>}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="w-full h-full bg-[#1e271c] border border-primary/40 rounded-lg p-3 flex items-center justify-between group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                                <span className="text-white font-medium pl-1 text-base">{answer.name}</span>
                                                <div className="flex gap-1 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "name", true)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.name_valid
                                                                ? "bg-primary text-black"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-primary hover:text-black"
                                                            }`}
                                                    >
                                                        <Check size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "name", false)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.name_valid === false
                                                                ? "bg-danger text-white"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-danger hover:text-white"
                                                            }`}
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="w-full h-full bg-[#1e271c] border border-primary/40 rounded-lg p-3 flex items-center justify-between group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                                <span className="text-white font-medium pl-1 text-base">{answer.animal}</span>
                                                <div className="flex gap-1 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "animal", true)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.animal_valid
                                                                ? "bg-primary text-black"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-primary hover:text-black"
                                                            }`}
                                                    >
                                                        <Check size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "animal", false)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.animal_valid === false
                                                                ? "bg-danger text-white"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-danger hover:text-white"
                                                            }`}
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="w-full h-full bg-[#1e271c] border border-primary/40 rounded-lg p-3 flex items-center justify-between group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                                <span className="text-white font-medium pl-1 text-base">{answer.place}</span>
                                                <div className="flex gap-1 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "place", true)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.place_valid
                                                                ? "bg-primary text-black"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-primary hover:text-black"
                                                            }`}
                                                    >
                                                        <Check size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "place", false)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.place_valid === false
                                                                ? "bg-danger text-white"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-danger hover:text-white"
                                                            }`}
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="w-full h-full bg-[#1e271c] border border-primary/40 rounded-lg p-3 flex items-center justify-between group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                                <span className="text-white font-medium pl-1 text-base">{answer.thing}</span>
                                                <div className="flex gap-1 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "thing", true)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.thing_valid
                                                                ? "bg-primary text-black"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-primary hover:text-black"
                                                            }`}
                                                    >
                                                        <Check size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => markAsValid(answer.id, "thing", false)}
                                                        className={`size-6 rounded flex items-center justify-center transition
    ${answer.thing_valid === false
                                                                ? "bg-danger text-white"
                                                                : "bg-[#2c3928] text-text-secondary hover:bg-danger hover:text-white"
                                                            }`}
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="sticky right-0 z-10 border-l border-border-dark bg-[#131811] p-3 flex items-center justify-center shadow-[-4px_0_12px_rgba(0,0,0,0.5)]">
                                            <span className="text-2xl font-bold text-primary">{answer.points_earned}</span>
                                        </td>
                                    </tr>
                                ))
                            )
                        }

                    </tbody>
                </table>
            </div>
            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
                {isFetching ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-400 font-semibold">Loading answers...</p>
                    </div>
                ) : answers.length === 0 ? (
                    <div className="glass-panel p-8 rounded-xl text-center">
                        <p className="text-gray-400">No answers submitted yet</p>
                    </div>
                ) : (
                    answers.map((answer) => (
                        <div key={answer.id} className="glass-panel p-4 rounded-xl border border-primary/30 space-y-4">
                            {/* Player Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg">{answer.player_name}</span>
                                    {playerId === answer.player_id && (
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded w-fit mt-1">You</span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Score</p>
                                    <p className="text-2xl font-bold text-primary">{answer.points_earned}</p>
                                </div>
                            </div>

                            {/* Answers Grid */}
                            <div className="space-y-3">
                                {/* Name */}
                                <div className="bg-[#1e271c] border border-primary/40 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Name</span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "name", true)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.name_valid
                                                    ? "bg-primary text-black"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "name", false)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.name_valid === false
                                                    ? "bg-danger text-white"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-white font-medium text-base">{answer.name || "—"}</span>
                                </div>

                                {/* Animal */}
                                <div className="bg-[#1e271c] border border-primary/40 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Animal</span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "animal", true)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.animal_valid
                                                    ? "bg-primary text-black"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "animal", false)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.animal_valid === false
                                                    ? "bg-danger text-white"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-white font-medium text-base">{answer.animal || "—"}</span>
                                </div>

                                {/* Place */}
                                <div className="bg-[#1e271c] border border-primary/40 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Place</span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "place", true)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.place_valid
                                                    ? "bg-primary text-black"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "place", false)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.place_valid === false
                                                    ? "bg-danger text-white"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-white font-medium text-base">{answer.place || "—"}</span>
                                </div>

                                {/* Thing */}
                                <div className="bg-[#1e271c] border border-primary/40 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Thing</span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "thing", true)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.thing_valid
                                                    ? "bg-primary text-black"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markAsValid(answer.id, "thing", false)}
                                                className={`size-7 rounded flex items-center justify-center transition ${answer.thing_valid === false
                                                    ? "bg-danger text-white"
                                                    : "bg-[#2c3928] text-text-secondary"
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-white font-medium text-base">{answer.thing || "—"}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Button variant="primary" type="button" onClick={() => handleConfirm()} loading={loading} disabled={loading}>
                Confirm Scoring
                <ArrowRight />
            </Button>
        </div>
    )
}