import { workoutService } from "@/services/workoutService";
import type { WorkoutPlan, WorkoutLog, CreateWorkoutLogRequest } from "@/types/workoutTypes";
import { useCallback, useEffect, useState } from "react";

export function useWorkoutPlans() {
    const [plans, setPlans] = useState<WorkoutPlan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        workoutService.getPlans()
            .then(setPlans)
            .catch(() => setError('No able to load workout plans.'))
            .finally(() => setIsLoading(false))
    }, [])

    return { plans, isLoading, error }
}

export function useWorkoutPlan(id: string) {
    const [plan, setPlan] = useState<WorkoutPlan | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        workoutService.getPlanById(id)
            .then(setPlan)
            .catch(() => setError('Plan is not found.'))
            .finally(() => setIsLoading(false))
    }, [id])

    return { plan, isLoading, error }
}

export function useWorkoutLogs() {
    const [logs, setLogs] = useState<WorkoutLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLogs = useCallback(() => {
        setIsLoading(true)
        workoutService.getLogs()
            .then(setLogs)
            .catch(() => setError('Not possible to load workout logs.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => { fetchLogs() }, [fetchLogs])

    const createLog = useCallback(async (data: CreateWorkoutLogRequest) => {
        const newLog = await workoutService.createLog(data)

        setLogs(prev => [newLog, ...prev])
        return newLog
    }, [])

    const deleteLog = useCallback(async (id: string) => {
        await workoutService.deleteLog(id)
        setLogs(prev => prev.filter(log => log.id !== id))
    }, [])

    return { logs, isLoading, error, createLog, deleteLog, refetch: fetchLogs }
}
