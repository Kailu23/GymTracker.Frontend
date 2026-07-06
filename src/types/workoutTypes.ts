export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type MuscleGroup = | 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs' | 'FullBody'
export type WorkoutGoal = 'Strength' | 'Hypertrophy' | 'Endurance' | 'WeightLoss'

export interface Exercise {
    id: string
    name: string
    muscleGroup: MuscleGroup
    description: string
    videoUrl?: string
    instructions: string[]
}

export interface WorkoutPlan {
    id: string
    name: string
    descriptions: string
    difficulty: DifficultyLevel
    goal: WorkoutGoal
    durationWeeks: number
    exercisesPerSession: number
    exercises: Exercise[]
    createdBy: string
    isPremium: boolean
}

export interface LogSet {
    id: string
    exerciseId: string
    exerciseName: string
    reps: number
    weightKg: number
    notes?: string
}

export interface WorkoutLog {
    id: string
    userId: string
    planId?: string
    planName: string
    date: string
    durationMinutes: number
    sets: LogSet[]
    notes?: string
}

export interface CreateLogSetRequest {
    exerciseId: string
    reps: number
    weightKg: number
    notes?: string
}

export interface CreateWorkoutLogRequest {
    planId?: string
    durationMinutes: number
    sets: CreateLogSetRequest[]
    notes?: string
}

export interface VolumeDataPoint {
    date: string
    totalVolumeKg: number
}

export interface ExerciseProgress {
    exerciseId: string
    exerciseName: string
    history: {
        date: string
        maxWeightKg: number
        totalReps: number
    }[]
}

export interface WorkoutStats {
    totalWorkouts: number
    totalVolumeKg: number
    currentStreakDays: number
    longestStreakDays: number
    mostUsedMuscleGroup: MuscleGroup
    weeklyVolume: VolumeDataPoint[]
    exerciseProgress: ExerciseProgress[]
}
