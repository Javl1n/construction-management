import { Worker } from "@/types";
import { Card } from "../ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { UserIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function WorkerCard({ worker, weekDays }: { worker: Worker, weekDays: Date[] }) {
    const now = new Date();

    return (
        <Card className="p-4 gap-3" id={worker.id.toString()}>
            <Item size={'sm'} className="p-0">
                <ItemMedia variant={'icon'}>
                    <UserIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>
                        {worker.name}
                    </ItemTitle>
                    {/* <ItemDescription> */}
                    {/*     Hello */}
                    {/* </ItemDescription> */}
                </ItemContent>
            </Item>
            {/* <Separator /> */}
            <div className="grid gap-4 grid-cols-7">
                {weekDays.map((day) => (
                    <div className={cn([
                        "aspect-square border rounded-2xl text-center flex flex-col justify-center gap-0",
                        day.getDay() == 0 && "bg-muted",
                        day.getDay() == now.getDay() && "ring ring-primary ring-offset-3"
                    ])} key={day.getDay()} >
                        <div className={cn([
                            "text-xs text-muted-foreground uppercase",
                            day.getDay() == 0 && "text-destructive"
                        ])}>
                            {format(day, "E")}
                        </div>
                        <div className="font-bold text-lg">
                            {format(day, "d")}
                        </div>
                    </div>
                ))}

            </div>
        </Card >

    )
}
