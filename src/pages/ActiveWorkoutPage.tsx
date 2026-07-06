import { useWorkoutPlan, useWorkoutLogs } from "@/hooks/useWorkouts";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Spinner } from "@/components/common/Spinner";
import type { CreateLogSetRequest } from "@/types/workoutTypes";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Timer, Plus, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function useTimer() {
    const [seconds, setSeconds] = useState(0)
    const [running, setRunning] = useState(false)

    useEffect(() => {
        if (!running) return

        const id = setInterval(() => setSeconds(s => s + 1), 1000)
        return () => clearInterval(id)
    }, [running])

    const start = useCallback(() => setRunning(true), [])
    const pause = useCallback(() => setRunning(false), [])
    const reset = useCallback(() => { setRunning(false); setSeconds(0) }, [])

    const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

    return { seconds, formatted, running, start, pause, reset }
}

interface SetRowProps {
    index: number
    exerciseId: string
    onAdd: (set: CreateLogSetRequest) => void
}

function SetRow({ index, exerciseId, onAdd }: SetRowProps) {
    const [reps, setReps] = useState('')
    const [weight, setWeight] = useState('')
    const [saved, setSaved] = useState(false)

    function handleSave() {
        if (!reps || !weight) return

        onAdd({ exerciseId, reps: Number(reps), weightKg: Number(weight) })
        setSaved(true)
    }

    return (
        <div className={`grid grid-cols-[2rem_1fr_1fr_auto] items-center gap-2 py-2
                    ${saved ? 'opacity-60' : ''} `}>
            <span className="text-sm text-[var(--color-text-muted)] text-center">{index + 1}</span>
            <Input
                placeholder="Reps" type="number" min={1}
                value={reps} onChange={e => setReps(e.target.value)}
                disabled={saved}
            />
            <Input
                placeholder="kg" type="number" min={0} step={0.5}
                value={weight} onChange={e => setWeight(e.target.value)}
                disabled={saved}
            />
            {saved
                ? <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                : <Button size="small" onClick={handleSave}>OK</Button>
            }
        </div>
    )
}

export function ActiveWorkoutPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const planId = searchParams.get('planId') ?? ''

    const { plan, isLoading } = useWorkoutPlan(planId)
    const { createLog } = useWorkoutLogs()
    const timer = useTimer()

    const [sets, setSets] = useState<Record<string, CreateLogSetRequest[]>>({})
    const [saving, setSaving] = useState(false)
    const [notes, setNotes] = useState('')

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { timer.start() }, [])

    function addSet(set: CreateLogSetRequest) {
        setSets(previous => ({
            ...previous,
            [set.exerciseId]: [...(previous[set.exerciseId] ?? []), set],
        }))
    }

    async function handleFinish() {
        const allSets = Object.values(sets).flat()
        if (allSets.length === 0) return

        setSaving(true)
        timer.pause()
        try {
            await createLog({
                planId: planId || undefined,
                durationMinutes: Math.ceil(timer.seconds / 60),
                sets: allSets,
                notes,
            })
            navigate('/dashboard')
        } finally {
            setSaving(false)
        }
    }
    if (isLoading) return <Spinner />

    const exercises = plan?.exercises ?? []
    const totalSets = Object.values(sets).flat().length

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {/* Header with timer */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">
                        {plan?.name ?? 'Free workout'}
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {totalSets} sets recorded
                    </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-2xl font-mono font-bold text-[var(--color-accent)]">
                        <Timer size={20} style={{ color: 'var(--color-accent)' }} />
                        {timer.formatted}
                    </div>
                    <button onClick={timer.running ? timer.pause : timer.start}
                        className="text-xs text--[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        {timer.running ? 'Pause' : 'Continue'}
                    </button>
                </div>
            </div>

            {/* Exercises */}
            {exercises.length === 0 ? (
                <p className="text-[var(--color-text-muted)] text-center py-12">
                    There are no exercises in this plan. Choose a plan or log in for a free workout.
                </p>
            ) : (
                exercises.map(exercise => (
                    <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    sets={sets[exercise.id]??[]}
                    onAddSet={addSet}
                    />
                ))
            )}

            {/* Notes */}
            <Input
            label="Notes (optional)"
            placeholder="How are you feeling today?"
            value={notes}
            onChange={e=>setNotes(e.target.value)}
            />

            {/* End workout */}
            <Button
            size="large"
            loading={saving}
            disabled={totalSets===0}
            onClick={handleFinish}
            className="w-full"
            >
            End workout: {totalSets} sets {totalSets !== 1 ? 's' : ''}
            </Button>
        </div>
    )
}

interface ExerciseCardProps {
    exercise: { id: string; name: string; muscleGroup: string }
    sets: CreateLogSetRequest[]
    onAddSet: (set: CreateLogSetRequest) => void
}

function ExerciseCard({ exercise, sets, onAddSet }: ExerciseCardProps) {
    const [rows, setRows] = useState(1)

    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{exercise.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{exercise.muscleGroup}</p>
                </div>
                {sets.length > 0 && (
                    <span className="text-xs text-[var(--color-success)] font-medium">
                        {sets.length} set{sets.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_1fr_auto] gap-2 mb-1">
                <span className="text-xs text-[var(--color-text-muted)] text-center">#</span>
                <span className="text-xs text-[var(--color-text-muted)]">Reps</span>
                <span className="text-xs text-[var(--color-text-muted)]">Weight</span>
                <span />
            </div>

            {Array.from({ length: rows }).map((_, i) => (
                <SetRow key={i} index={i} exerciseId={exercise.id} onAdd={onAddSet} />
            ))}

            <button
                onClick={() => setRows(r => r + 1)}
                className="mt-3 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]
            hover:text-[var(--color-accent)] transition-colors"
            >
            <Plus size={14}/> Add set
            </button>
        </div>
    )
}
