import { IconName } from "lucide-react/dynamic"
import { User } from "./auth"

export type ExcludedDay = {
    // columns
    id: number
    project_id: number
    date: string
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    // counts
    // exists
    project_exists: boolean
}

export type Item = {
    // columns
    id: number
    project_id: number
    work_id: number
    priority: number
    estimated_days: number
    date_started: string | null
    date_ended: string | null
    worker_count: number
    worker_rate: number
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    work: Work
    materials: Material[]
    workers: Worker[]
    // counts
    materials_count: number
    workers_count: number
    // exists
    project_exists: boolean
    work_exists: boolean
    materials_exists: boolean
    workers_exists: boolean
}

export type Material = {
    // columns
    id: number
    name: string
    unit: string
    price: number
    created_at: string | null
    updated_at: string | null
    // relations
    works: Work[]
    items: Item[]
    purchases: Purchase[]
    // counts
    works_count: number
    items_count: number
    purchases_count: number
    // exists
    works_exists: boolean
    items_exists: boolean
    purchases_exists: boolean
}

export type Project = {
    // columns
    id: number
    user_id: number
    name: string
    icon: IconName
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    excluded_days: ExcludedDay[]
    items: Item[]
    purchases: Purchase[]
    // counts
    excluded_days_count: number
    items_count: number
    purchases_count: number
    // exists
    user_exists: boolean
    excluded_days_exists: boolean
    items_exists: boolean
    purchases_exists: boolean
}

export type Purchase = {
    // columns
    id: number
    project_id: number
    purchased_at: string
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    materials: Material[]
    // counts
    materials_count: number
    // exists
    project_exists: boolean
    materials_exists: boolean
}

export type Work = {
    // columns
    id: number
    name: string
    created_at: string | null
    updated_at: string | null
    // relations
    items: Item[]
    materials: Material[]
    // counts
    items_count: number
    materials_count: number
    // exists
    items_exists: boolean
    materials_exists: boolean
}

export type Worker = {
    // columns
    id: number
    user_id: number
    name: string
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    items: Item[]
    // counts
    items_count: number
    // exists
    user_exists: boolean
    items_exists: boolean
}

