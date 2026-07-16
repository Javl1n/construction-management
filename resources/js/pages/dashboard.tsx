import { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Project, DashboardPageProps, DashboardItem, DashboardWorker } from '@/types';
import EmptyProject from '@/components/project/empty';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, ItemSeparator } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DynamicIcon } from 'lucide-react/dynamic';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { GanttChartPlanCard } from '@/components/plans/gantt';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function formatPeso(amount: number) {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function today() {
    return new Date().toISOString().split('T')[0];
}

type WorkerLogRow = { role: string; quantity: number | '' };

function LogDialog({ item }: { item: DashboardItem }) {
    const [open, setOpen] = useState(false);

    if (item.blocked_by) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Button variant="outline" size="sm" disabled>
                                <PlusIcon /> Log
                            </Button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Waiting for "{item.blocked_by}" to finish first
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const initialWorkerRows: WorkerLogRow[] = item.workers.length > 0
        ? item.workers.map(w => ({ role: w.role, quantity: w.quantity }))
        : [{ role: '', quantity: '' }];

    const { data, setData, post, processing, reset, errors } = useForm<{
        date: string;
        quantity: number | '';
        worker_logs: WorkerLogRow[];
    }>({
        date: today(),
        quantity: item.quantity_done || ('' as unknown as number),
        worker_logs: initialWorkerRows,
    });

    function addWorkerRow() {
        setData('worker_logs', [...data.worker_logs, { role: '', quantity: '' }]);
    }

    function removeWorkerRow(index: number) {
        setData('worker_logs', data.worker_logs.filter((_, i) => i !== index));
    }

    function updateWorkerRow(index: number, field: keyof WorkerLogRow, value: string | number) {
        const rows = [...data.worker_logs];
        rows[index] = { ...rows[index], [field]: value };
        setData('worker_logs', rows);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/items/${item.id}/logs`, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    const progressPct = item.quantity > 0
        ? Math.min((item.quantity_done / item.quantity) * 100, 100)
        : 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon /> Log
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Daily Progress</DialogTitle>
                    <DialogDescription>
                        Enter total progress so far on "{item.name}" · currently {item.quantity_done} / {item.quantity} {item.unit} ({progressPct.toFixed(1)}%)
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="log-date">Date</Label>
                        <Input
                            id="log-date"
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                        />
                        {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="log-quantity">Total done so far ({item.unit})</Label>
                        <Input
                            id="log-quantity"
                            type="number"
                            step="any"
                            min={item.quantity_done}
                            max={item.quantity}
                            placeholder="0"
                            value={data.quantity}
                            onChange={e => setData('quantity', e.target.value ? parseFloat(e.target.value) : '')}
                        />
                        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Workers Deployed</Label>
                        {data.worker_logs.map((row, index) => {
                            const planned = item.workers.find(w => w.role === row.role);
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        placeholder="Role (e.g. Mason)"
                                        value={row.role}
                                        onChange={e => updateWorkerRow(index, 'role', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Count"
                                        value={row.quantity}
                                        onChange={e => updateWorkerRow(index, 'quantity', e.target.value ? parseInt(e.target.value) : '')}
                                        className="w-20"
                                    />
                                    {planned
                                        ? <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">/ {planned.quantity} planned</span>
                                        : <span className="w-20 shrink-0" />
                                    }
                                    {data.worker_logs.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => removeWorkerRow(index)}
                                        >
                                            <Trash2Icon />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                        {errors['worker_logs'] && <p className="text-sm text-destructive">{errors['worker_logs']}</p>}
                        <Button type="button" variant="ghost" size="sm" onClick={addWorkerRow} className="self-start">
                            <PlusIcon /> Add role
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>Save Log</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function Dashboard() {
    const props = usePage().props as unknown as { project: Project } & DashboardPageProps;
    const { project, stats, items, purchases, cost_breakdown } = props;

    if (!project) {
        return <EmptyProject />;
    }

    const ganttItems = items.map(item => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        quantity: 0,
        unit: '',
        planned_days: item.days,
        prerequisites: item.prerequisites,
        materials: [],
        laborers: [],
        equipment: [],
    }));

    const progressDays: Record<number, number> = {};
    items.forEach(item => {
        progressDays[item.id] = item.log_days;
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Stat Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {/* Progress */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Project Progress</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.completion_pct}%
                                {stats.planned_pct !== null && (
                                    <span className={`ml-2 text-base font-medium ${stats.completion_pct >= stats.planned_pct ? 'text-green-500' : 'text-destructive'}`}>
                                        {stats.completion_pct >= stats.planned_pct ? '▲' : '▼'} {Math.abs(stats.completion_pct - stats.planned_pct).toFixed(1)}%
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${stats.completion_pct}%` }}
                                />
                                {stats.planned_pct !== null && (
                                    <div
                                        className="absolute top-0 h-full w-0.5 bg-foreground/40"
                                        style={{ left: `${stats.planned_pct}%` }}
                                    />
                                )}
                            </div>
                            {stats.planned_pct !== null && (
                                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                                    <span>Actual</span>
                                    <span>Planned {stats.planned_pct}% · Day {stats.days_elapsed} of {stats.planned_days}</span>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                                {stats.completed_quantity.toFixed(1)} / {stats.total_quantity.toFixed(1)} units complete
                            </p>
                            {stats.days_elapsed === null && stats.planned_days !== null && (
                                <Button
                                    size="sm"
                                    className="mt-3 w-full"
                                    onClick={() => router.post('/project/start')}
                                >
                                    Start Project
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Critical Path */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Critical Path</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.planned_days != null ? stats.planned_days : '—'}
                                {stats.planned_days != null && <span className="ml-1 text-lg font-normal">days</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Scheduled duration</p>
                            <p className="text-sm text-muted-foreground">
                                {project.date_started
                                    ? <>Started {formatDate(project.date_started)}</>
                                    : 'Not started yet'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    {/* Estimated Cost */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Estimated Cost</CardDescription>
                            <CardTitle className="text-2xl">{formatPeso(stats.total_estimated_cost)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Labor + Materials + Equipment</p>
                        </CardContent>
                    </Card>

                    {/* Total Purchased */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Purchased</CardDescription>
                            <CardTitle className="text-2xl">{formatPeso(stats.total_purchased)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Total purchases to date</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Items Progress */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Work Items</CardTitle>
                            <CardDescription>Daily progress logs per item</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ItemGroup>
                                {items.map((item, index) => {
                                    const pct = item.quantity > 0
                                        ? Math.min((item.quantity_done / item.quantity) * 100, 100)
                                        : 0;
                                    return (
                                        <div key={item.id}>
                                            {index > 0 && <ItemSeparator />}
                                            <Item size="sm">
                                                <ItemMedia variant="icon">
                                                    <DynamicIcon name={item.icon} />
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>{item.name}</ItemTitle>
                                                    <ItemDescription>{formatPeso(item.cost)} &middot; {item.days} days</ItemDescription>
                                                </ItemContent>
                                                <ItemActions>
                                                    <div className="flex flex-col items-end gap-1 min-w-28">
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.quantity_done} / {item.quantity} {item.unit}
                                                        </span>
                                                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-primary transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                            {item.planned_quantity_done !== null && (
                                                                <div
                                                                    className="absolute top-0 h-full w-0.5 bg-foreground/40"
                                                                    style={{ left: `${Math.min((item.planned_quantity_done / item.quantity) * 100, 100)}%` }}
                                                                />
                                                            )}
                                                        </div>
                                                        {item.planned_quantity_done !== null && (
                                                            <span className={`text-xs font-medium ${item.quantity_done >= item.planned_quantity_done ? 'text-green-500' : 'text-destructive'}`}>
                                                                {item.quantity_done >= item.planned_quantity_done ? 'On track' : `${(item.planned_quantity_done - item.quantity_done).toFixed(1)} ${item.unit} behind`}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <LogDialog item={item} />
                                                </ItemActions>
                                            </Item>
                                        </div>
                                    );
                                })}
                            </ItemGroup>
                        </CardContent>
                    </Card>

                    {/* Cost Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cost Breakdown</CardTitle>
                            <CardDescription>Estimated cost by category</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Labor</TableCell>
                                        <TableCell className="text-right">{formatPeso(cost_breakdown.labor)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Materials</TableCell>
                                        <TableCell className="text-right">{formatPeso(cost_breakdown.materials)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Equipment</TableCell>
                                        <TableCell className="text-right">{formatPeso(cost_breakdown.equipment)}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell className="font-semibold">Total</TableCell>
                                        <TableCell className="text-right font-semibold">{formatPeso(stats.total_estimated_cost)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Purchases History */}
                {purchases.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchases</CardTitle>
                            <CardDescription>Material purchase history for this project</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Materials</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchases.map(purchase => (
                                        <TableRow key={purchase.id}>
                                            <TableCell>{formatDate(purchase.purchased_at)}</TableCell>
                                            <TableCell>{purchase.items_count} {purchase.items_count === 1 ? 'item' : 'items'}</TableCell>
                                            <TableCell className="text-right">{formatPeso(purchase.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2} className="font-semibold">Total Purchased</TableCell>
                                        <TableCell className="text-right font-semibold">{formatPeso(stats.total_purchased)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Gantt Chart */}
                <GanttChartPlanCard items={ganttItems} progressDays={progressDays} />

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
