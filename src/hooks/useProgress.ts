import { workoutService } from "@/services/workoutService";
import type { WorkoutStats } from "@/types/workoutTypes";
import { useEffect, useState } from "react";

export function useProgress() {
    const [stats, setStats] = useState<WorkoutStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        workoutService.getStats()
            .then(setStats)
            .catch(() => setError('Not possible to load statistics.'))
            .finally(() => setIsLoading(false))
    }, [])

    return { stats, isLoading, error }
}
