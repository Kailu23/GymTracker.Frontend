import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";
import { useWorkoutPlans } from "@/hooks/useWorkouts";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/common/Button";
import type { DifficultyLevel, WorkoutGoal } from "@/types/workoutTypes";

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    Beginner: 'Begginer',
    Intermediate: 'Intermediate',
    Advanced: 'Advanced'
}

const DIFFICULTY_COLOR: Record<DifficultyLevel, string>= {
    Beginner: 'text-[var(--color-success)]',
    Intermediate: 'text-yellow-500',
    Advanced: 'text-[var(--color-danger)]',
}

const GOAL_LABELS: Record<WorkoutGoal, string> = {
    Strength: 'Strength',
    Hypertrophy: 'Hypertrophy',
    Endurance: 'Endurance',
    WeightLoss: 'WeightLoss',
}

type FilterGoal = WorkoutGoal | 'All'
type FilterDifficulty = DifficultyLevel | 'All'

export function WorkoutPlansPage() {
    const { plans, isLoading, error } = useWorkoutPlans()
    const user = useAuthStore(s => s.user)
    const isPremium = user?.subscriptionStatus === 'premium'

    const [goalFilter, setGoalFilter] = useState<FilterGoal>('All')
    const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>('All')

    const filtered = plans.filter(p => {
        const goalMatch = goalFilter === 'All' || p.goal === goalFilter
        const difficultyMatch = difficultyFilter === 'All' || p.difficulty === difficultyFilter
        return goalMatch && difficultyMatch
    })

    if (isLoading) return <Spinner />

    if (error) return <p className="text-[var(--color-danger)]">{error}</p>

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Workout plans</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Choose a plan that suits your goals</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {/* Goal filters */}
                <div className="flex gap-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-1">
                    {(['All', 'Strength', 'Hypertrophy', 'Endurance', 'WeightLoss'] as FilterGoal[]).map(g => (
                        <button key={g}
                            onClick={() => setGoalFilter(g)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
${goalFilter === g
                                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            {g == 'All' ? 'All goals' : GOAL_LABELS[g as WorkoutGoal]}
                        </button>
                    ))}
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-1">
                    {(['All', 'Beginner', 'Intermediate', 'Advanced'] as FilterDiff[]).map(d => (
                        <button key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${difficultyFilter === d
                                    ? 'bg-[var(--color-accent)] text[var(--color-accent-text)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            {d === 'All' ? "All levels" : DIFFICULTY_LABELS[d as DifficultyLevel]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid workout plans */}
            {filtered.length === 0 ? (
                <p className="text-[var(--color-text-muted)] text-center py-12">
                    There are no plans for the selected filters.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(plan => {
                        const locked = plan.isPremium && !isPremium
                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-[var(--color-bg-card)] border border-[var(--color-border)]
                    rounded-xl p-6 flex flex-col gap-4 transition-colors duration-200
                    ${locked ? 'opacity-70' : 'hover:border-[var(--color-accent)]'}`}
                            >
                                {/* Premium lock badge */}
                                {locked && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-xs
                        text-[var(--color-accent)] font-medium">
                                        <Lock size={12} /> Premium
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold text-[var(--color-text)]">{plan.name}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{plan.descriptions}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={`font-medium ${DIFFICULTY_COLOR[plan.difficulty]}`}>
                                        {DIFFICULTY_LABELS[plan.difficulty]}
                                    </span>
                                    <span className="text-var(--color-text-muted)">:</span>
                                    <span className="text-var(--color-text-muted)">{GOAL_LABELS[plan.goal]}</span>
                                    <span className="text-var(--color-text-muted)">:</span>
                                    <span className="text-var(--color-text-muted)">{plan.durationWeeks} week{plan.durationWeeks > 1 ? 's' : ''}</span>
                                </div>

                                {locked ? (
                                    <Link to="/subscription">
                                    <Button variant="secondary" size="small" className="w-full" icon={<Lock size={14}/>}>
                                    Unlock Premium
                                    </Button>
                                    </Link>
                                ): (
                                <Link to={`/workout?planId=${plan.id}`}>
                                <Button size="small" className="w-full" icon={<ChevronRight size={14} />}>
                                Start plan
                                </Button>
                                </Link>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
