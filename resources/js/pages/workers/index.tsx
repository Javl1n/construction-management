import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import WorkerCard from "@/components/workers/card";
import CreateWorkerDialog from "@/components/workers/create-dialog";
import { cn } from "@/lib/utils";
import workers from "@/routes/workers";
import { Worker } from "@/types";
import { Link } from "@inertiajs/react";
import { PlusIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";

export type WorkerIndexProps = {
    workers: Worker[];
}

export default function WorkerIndexPage({ workers }: WorkerIndexProps) {
    const weekDays = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);

        startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    }, []);

    const sidebar = useSidebar();

    return (
        <div className="px-4">
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48 lg:block hidden py-6">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {workers.map((worker) => (
                            <Button
                                key={`navigation-${worker.id}`}
                                size="sm"
                                variant="ghost"
                                className={cn('w-full justify-start text-sm', {
                                    'bg-muted': false
                                })}
                            >
                                <Link href={`#${worker.id}`}>
                                    {worker.name}
                                </Link>
                            </Button>
                        ))}
                        <CreateWorkerDialog>
                            <Button
                                size="sm"
                                variant="ghost"
                                className={cn('w-full justify-start text-sm', {
                                    'bg-muted': false
                                })}
                            >
                                <PlusIcon />
                                Add Worker
                            </Button>
                        </CreateWorkerDialog>
                    </nav>
                </aside>
                <div className="flex-1 md:max-w-3xl">
                    <section className={cn([
                        "overflow-auto lg:pe-4 py-6",
                        sidebar.open ? "lg:h-[calc(100vh-4rem)] max-w-3xl" : "lg:h-[calc(100vh-3rem)] max-w-2xl"
                    ])}>
                        <ItemGroup className="gap-4">
                            {workers.map((worker) => (
                                <WorkerCard worker={worker} weekDays={weekDays} key={`worker-${worker.id}`} />
                            ))}
                        </ItemGroup>
                    </section>
                </div>
            </div>
        </div>
    )
}

WorkerIndexPage.layout = {
    breadcrumbs: [
        {
            title: 'Workers',
            href: workers.index(),
        },
    ],
};
