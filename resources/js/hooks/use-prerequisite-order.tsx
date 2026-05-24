import { CreateWorkItem } from "@/components/items/create";
import { useMemo } from "react";

export interface WorkItem {
    id: number,
    name: string
    prerequisites: number[],
    planned_days: number
}

export function usePrerequisiteOrder<T extends WorkItem>(items: T[]) {
    const startDays = useMemo(() => {
        const map = Object.fromEntries(items.map(i => [i.id, i]))
        const result: Record<number, number> = {}
        const resolving = new Set<number>();

        function resolve(id: number): number {
            if (result[id] !== undefined) return result[id]

            if (resolving.has(id)) return 1
            resolving.add(id)

            const item = map[id]
            if (!item.prerequisites.length) return (result[id] = 1)

            const depEnds = item.prerequisites.map(
                pid => resolve(pid) + map[pid].planned_days - 1
            )
            return (result[id] = Math.max(...depEnds) + 1)
        }

        items.forEach(i => resolve(i.id))
        return result
    }, [items])

    const totalDays = useMemo(
        () => Math.max(...items.map(i => startDays[i.id] + i.planned_days - 1)),
        [items, startDays]
    )

    const sorted = useMemo(
        () => [...items].sort((a, b) => startDays[a.id] - startDays[b.id]),
        [items, startDays]
    )

    return { startDays, totalDays, sorted }
}
