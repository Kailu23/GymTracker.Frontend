import { Dumbbell, TrendingUp, Flame, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProgress } from "@/hooks/useProgress";
import { useWorkoutLogs } from "@/hooks/useWorkouts";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/common/Button";

interface StatCardProps {
    icon: React.ElementType
    label: string
    value: string | number
    sub?: string
}

function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}>
                    <Icon size={16} style={{ color: 'var(--color-accent)' }} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-[var(--color-text)]">{value}</p>
                {sub && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{sub}</p>}
            </div>
        </div>
    )
}

export function DashboardPage() {
    const user = useAuthStore(s => s.user)
    const { stats, isLoading: statsLoading } = useProgress()
    const { logs, isLoading: logsLoading } = useWorkoutLogs()

    const isLoading = statsLoading || logsLoading
    const recentLogs = logs.slice(0, 5)

    return (
        <div className="flex flex-col gap-8">

            {/* Hello */}
            <div>
                <h1 className="text-2xl font-bold text-[var(---color-text)]">
                    Good morning, {user?.firstName}!
                </h1>
                <p className="text-[var(--color-text-muted)] mt-1">
                    Here is an overview of your training
                </p>
            </div>

            {isLoading ? <Spinner /> : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Dumbbell} label="Total workouts"
                            value={stats?.totalWorkouts ?? 0}
                        />
                        <StatCard
                            icon={TrendingUp} label="Total volume"
                            value={stats ? `${(stats.totalVolumeKg / 1000).toFixed(1)}t` : '0'}
                            sub="Total lifted"
                        />
                        <StatCard
                            icon={Flame} label="Current streak"
                            value={`${stats?.currentStreakDays ?? 0} days`}
                            sub={`Record: ${stats?.longestStreakDays ?? 0} days`}
                        />
                        <StatCard
                            icon={Calendar} label="This week"
                            value={stats?.weeklyVolume?.slice(-1)[0]?.totalVolumeKg
                                ? `${stats?.weeklyVolume?.slice(-1)[0]?.totalVolumeKg} kg`
                                : '0 kg'}
                            sub="Volume"
                        />
                    </div>

                    {/* Recent workouts */}
                    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                            <h2 className="font-bold text-[var(--color-text)]">Recent workouts</h2>
                            <Link to="/workout">
                                <Button variant="ghost" size="small">See all</Button>
                            </Link>
                        </div>

                        {recentLogs.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-[var(--color-text-muted)] mb-4">No training sessions recorded yet.</p>
                                <Link to="/plans">
                                    <Button>Choose workout plan</Button>
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[var(--color-border)]">
                                {recentLogs.map(log => (
                                    <li key={log.id} className="flex items-center justify-between px-5 py-3.5">
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text)]">
                                                {log.planName ?? 'Free workout'}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                                {new Date(log.date).toLocaleDateString('hr-HR')} : {log.durationMinutes} min : {log.sets.length} sets
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-[var(--color-accent)]">
                                            {log.sets.reduce((acc, s) => acc + s.reps * s.weightKg, 0)} kg
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-3">
                        <Link to="/workout"><Button icon={<Dumbbell size={16} />}>New workout</Button></Link>
                        <Link to="/plans"><Button variant="secondary">View workout plans</Button></Link>
                        <Link to="/progress"><Button variant="secondary">See progress</Button></Link>
                    </div>
                </>
            )}
        </div>
    )
}
