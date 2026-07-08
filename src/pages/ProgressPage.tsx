import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProgress } from "@/hooks/useProgress";
import { Spinner } from "@/components/common/Spinner";
import { type ExerciseProgress } from "@/types/workoutTypes";

function ChartToolTip({ active, payload, label }: {
    active?: boolean,
    payload?: { value: number; name: string }[]
    label?: string
}) {
    if (!active || !payload?.length) return null

    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm shadow-lg">
            <p className="text-[var(--color-text-muted)] mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.name} className="font-semibold text-[var(--color-text)]">
                    {p.value} kg
                </p>
            ))}
        </div>
    )
}

function ExerciseProgressCard({ data }: { data: ExerciseProgress }) {
    const chartData = data.history.map(h => ({
        date: new Date(h.date).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit' }),
        weight: h.maxWeightKg,
    }))

    const maxWeight = Math.max(...data.history.map(h => h.maxWeightKg))
    const firstWeight = data.history[0]?.maxWeightKg ?? 0
    const improvement = maxWeight - firstWeight

    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text)]">{data.exerciseName}</h3>
                {improvement > 0 && (
                    <span className="text-xs font-medium text-[var(--color-success)]">
                        +{improvement} kg
                    </span>
                )}
            </div>
            <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={32} />
                    <Tooltip content={<ChartToolTip />} />
                    <Line
                        type="monotone" dataKey="weight"
                        stroke="var(--color-accent)" strokeWidth={2}
                        dot={{ fill: 'var(--color-accent)', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export function ProgressPage() {
    const { stats, isLoading, error } = useProgress()

    if (isLoading) return <Spinner />
    if (error) return <p className="text-[var(--color-danger)]">{error}</p>
    if (!stats) return null

    const volumeData = (stats.weeklyVolume ?? []).map(v => ({
        date: new Date(v.date).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit' }),
        volume: v.totalVolumeKg,
    }))

    const exerciseProgress = stats.exerciseProgress ?? []

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Progress</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Track your progress through time</p>
            </div>

            {/* Weekly volume */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5">
                <h2 className="font-semibold text-[var(--color-text)] mb-4">Weekly volume (kg)</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3 " stroke="var(--color-border)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} width={40} />
                        <Tooltip content={<ChartToolTip />} />
                        <Bar dataKey="volume" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Progress per workout */}
            {exerciseProgress.length > 0 && (
                <div>
                    <h2 className="font-semibold text-[var(--color-text)] mb-4">Progress per workout</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {exerciseProgress.map(ep => (
                            <ExerciseProgressCard key={ep.exerciseId} data={ep} />
                        ))}
                    </div>
                </div>
            )}

            {exerciseProgress.length === 0 && (
                <p className="text-center text-[var(--color-text-muted)] py-12">
                    There is not enough data to show progress. Log some workouts!
                </p>
            )}
        </div>
    )
}
