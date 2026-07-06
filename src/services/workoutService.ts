import { string } from "zod";
import { api } from "./api";
import type {
    WorkoutPlan, WorkoutLog, WorkoutStats,
    CreateWorkoutLogRequest
} from "@/types/workoutTypes";

export const workoutService = {
    getPlans: () =>
        api.get<WorkoutPlan[]>('/workout-plans').then(r => r.data),

    getPlanById: (id:string)=>
        api.get<WorkoutPlan>(`/workout-plans/${id}`).then(r=>r.data),

    getLogs:()=>
        api.get<WorkoutLog[]>('/workout-logs').then(r => r.data),

    getLogById: (id:string)=>
        api.get<WorkoutLog>(`/workout-logs/${id}`).then(r=>r.data),

    createLog:(data:CreateWorkoutLogRequest)=>
        api.post<WorkoutLog>('/workout-logs', data).then(r=>r.data),

    deleteLog:(id:string)=>
        api.delete(`/workout-logs/${id}`),

    getStats:()=>
        api.get<WorkoutStats>('/workout-logs/stats').then(r=>r.data),
}
