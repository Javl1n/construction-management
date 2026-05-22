import { DynamicIcon } from "lucide-react/dynamic";
import { CreateWorkItem } from "../items/create";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { IconPicker } from "../ui/icon-picker";
import { Item, ItemActions, ItemContent, ItemMedia } from "../ui/item";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PlaceholderPattern } from "../ui/placeholder-pattern";


function computeStartDays(items: CreateWorkItem[]) {
    const map = Object.fromEntries(items.map(i => [i.id, i]));
    const startDay: Record<number, number> = {};

    function resolve(id: number): number {
        if (startDay[id] !== undefined) return startDay[id];
        const item = map[id];
        if (!item.prerequisites.length) return (startDay[id] = 1);

        const depEnds = item.prerequisites.map(
            pid => resolve(pid) + map[pid].planned_days - 1
        )

        return (startDay[id] = Math.max(...depEnds) + 1);
    }

    items.forEach(i => resolve(i.id));
    return startDay;
}

export function GanttChartPlanCard({ items }: { items: CreateWorkItem[] }) {
    const startDays = computeStartDays(items)
    const totalDays = Math.max(...items.map(i => startDays[i.id] + i.planned_days - 1))
    const totalDaysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
    const sorted = [...items].sort((a, b) => startDays[a.id] - startDays[b.id]);
    const onSchedule = (item: CreateWorkItem, day: number): boolean => {
        return day >= startDays[item.id] && day <= item.planned_days + startDays[item.id] - 1
    }
    return (
        <Card>
            <CardHeader>
                <Item className="p-0">
                    <ItemMedia variant={'icon'}>
                        <DynamicIcon name={'gantt-chart'} />
                    </ItemMedia>
                    <ItemContent>
                        <CardTitle>
                            {'Gantt Chart'}
                        </CardTitle>
                        <CardDescription>
                            View Gantt Chart for this project.
                        </CardDescription>
                    </ItemContent>
                </Item>
            </CardHeader>
            <CardContent>
                <div className="flex border">
                    <div className="grid">
                        <div className="border h-10 flex flex-col justify-center px-2">
                            <div>
                                Items
                            </div>
                        </div>
                        {sorted.map((item, index) => (
                            <div key={index} className="border h-10 flex flex-col justify-center px-2">
                                {item.name}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 overflow-x-scroll">
                        <div className="flex">
                            {totalDaysArray.map((number, index) => (
                                <div key={index} className="border h-10 min-w-15 flex flex-col justify-center text-center text-muted-foreground text-sm">
                                    D{number}
                                </div>
                            ))}
                        </div>
                        {sorted.map((item, index) => (
                            <div key={index} className="flex">
                                {totalDaysArray.map((day) => (
                                    <div className={cn([
                                        "border h-10 min-w-15 relative",
                                        onSchedule(item, day) && ""
                                    ])}
                                    >
                                        {onSchedule(item, day) && (
                                            <PlaceholderPattern className="w-full h-full stroke-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
