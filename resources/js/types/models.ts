import { IconName } from "lucide-react/dynamic"
import { User } from "./auth"

export interface Item {
    // columns
    id: number
    project_id: number
    name: string
    order: number
    planned_days: number
    date_started: string | null
    date_ended: string | null
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

export interface Material {
    // columns
    id: number
    name: string
    unit: string
    price: number
    created_at: string | null
    updated_at: string | null
    // relations
    items: Item[]
    purchases: Purchase[]
    // counts
    items_count: number
    purchases_count: number
    // exists
    items_exists: boolean
    purchases_exists: boolean
}

export interface Project {
    // columns
    id: number
    user_id: number | null
    name: string
    icon: IconName
    planned_days: number | null
    date_started: string | null
    date_ended: string | null
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    items: Item[]
    purchases: Purchase[]
    workers: Worker[]
    // counts
    items_count: number
    purchases_count: number
    workers_count: number
    // exists
    user_exists: boolean
    items_exists: boolean
    purchases_exists: boolean
    workers_exists: boolean
}

export interface Purchase {
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

export interface SupervisorPayroll {
    // columns
    id: number
    role: string
    cost: number
    paid_at: string
    created_at: string | null
    updated_at: string | null
}

// export interface User {
//     // columns
//     id: number
//     role: string
//     name: string
//     email: string
//     email_verified_at: string | null
//     password?: string
//     remember_token?: string | null
//     created_at: string | null
//     updated_at: string | null
//     two_factor_secret?: string | null
//     two_factor_recovery_codes?: string | null
//     two_factor_confirmed_at: string | null
//     // relations
//     projects: Project[]
//     // notifications: DatabaseNotification[]
//     // counts
//     projects_count: number
//     notifications_count: number
//     // exists
//     projects_exists: boolean
//     notifications_exists: boolean
// }

export interface Worker {
    // columns
    id: number
    project_id: number
    role: string
    quantity: number
    rate: number
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    payroll: WorkerPayroll[]
    // counts
    payroll_count: number
    // exists
    project_exists: boolean
    payroll_exists: boolean
}

export interface WorkerPayroll {
    // columns
    id: number
    worker_id: number
    cost: number
    paid_at: string
    created_at: string | null
    updated_at: string | null
    // relations
    worker: Worker
    // counts
    // exists
    worker_exists: boolean
}

