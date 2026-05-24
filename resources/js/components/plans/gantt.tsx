import { DynamicIcon } from "lucide-react/dynamic";
import { CreateWorkItem } from "../items/create";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { IconPicker } from "../ui/icon-picker";
import { Item, ItemActions, ItemContent, ItemMedia } from "../ui/item";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PlaceholderPattern } from "../ui/placeholder-pattern";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { usePrerequisiteOrder } from "@/hooks/use-prerequisite-order";


export function GanttChartPlanCard({ items }: { items: CreateWorkItem[] }) {
    const { startDays, totalDays, sorted } = usePrerequisiteOrder<CreateWorkItem>(items)
    const totalDaysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
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
                    <ScrollArea className="flex-1 overflow-x-scroll">
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
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
