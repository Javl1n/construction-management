import { IconName } from "lucide-react/dynamic"
import { User } from "./auth"

export interface Equipment {
    // columns
    id: number
    name: string
    quantity: number
    rate: number
    created_at: string | null
    updated_at: string | null
    // relations
    item: Item
    // counts
    // exists
    item_exists: boolean
}

export interface Item {
    // columns
    id: number
    project_id: number
    name: string
    icon: IconName
    quantity: number
    unit: string
    days: number
    completed: boolean
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    materials: Material[]
    prerequisites: Item[]
    dependents: Item[]
    equipment: Equipment[]
    // counts
    materials_count: number
    prerequisites_count: number
    dependents_count: number
    equipment_count: number
    // exists
    project_exists: boolean
    materials_exists: boolean
    prerequisites_exists: boolean
    dependents_exists: boolean
    equipment_exists: boolean
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
//     notifications: DatabaseNotification[]
//     // counts
//     projects_count: number
//     notifications_count: number
//     // exists
//     projects_exists: boolean
//     notifications_exists: boolean
// }

export interface DashboardStats {
    completion_pct: number
    planned_pct: number | null
    total_quantity: number
    completed_quantity: number
    total_items: number
    planned_days: number | null
    days_elapsed: number | null
    total_estimated_cost: number
    total_purchased: number
}

export interface DashboardWorker {
    id: number
    role: string
    quantity: number
    rate: number
}

export interface DashboardItem {
    id: number
    name: string
    icon: IconName
    days: number
    quantity: number
    unit: string
    quantity_done: number
    planned_quantity_done: number | null
    cost: number
    prerequisites: number[]
    blocked_by: string | null
    log_days: number
    workers: DashboardWorker[]
}

export interface DashboardPurchase {
    id: number
    purchased_at: string
    total: number
    items_count: number
}

export interface DashboardCostBreakdown {
    labor: number
    equipment: number
    materials: number
}

export interface DashboardPageProps {
    stats: DashboardStats
    items: DashboardItem[]
    purchases: DashboardPurchase[]
    cost_breakdown: DashboardCostBreakdown
}

export interface Worker {
    // columns
    id: number
    item_id: number
    role: string
    quantity: number
    rate: number
    created_at: string | null
    updated_at: string | null
    // relations
    project: Project
    // counts
    // exists
    project_exists: boolean
}

