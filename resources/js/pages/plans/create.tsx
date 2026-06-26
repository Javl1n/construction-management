import DeveloperDraftJSON from "@/components/developer/draft-json";
import CreateWorkItemCard, { CreateWorkItem } from "@/components/items/create";
import { MaterialDatalist } from "@/components/materials/datalist";
import { GanttChartPlanCard } from "@/components/plans/gantt";
import { PlanPath } from "@/components/plans/path";
import ProjectEssentialsForm from "@/components/project/essentials-form";
import { FieldError } from "@/components/ui/field";
import { usePrerequisiteOrder } from "@/hooks/use-prerequisite-order";
import { ScrollNavAside, ScrollNavAsideButton, ScrollNavAsideHeader, ScrollNavContent, ScrollNavItem, ScrollNavLayout, useScrollNav } from "@/layouts/scroll-nav-layout";
import drafts from "@/routes/drafts";
import plans from "@/routes/plans";
import projects from "@/routes/projects";
import { Auth, Project, User } from "@/types";
import { InertiaForm, useForm, usePage } from "@inertiajs/react";
import { ChartGanttIcon, FileClock, FormInputIcon, LucideWalletCards, Plus, Save, TableIcon, Users, WorkflowIcon } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { parse } from "path";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type CreatePlanProp = {
    name: Project['name'];
    icon: Project['icon'];
    engineer: User['id'];
    planned_days: number;
    items: CreateWorkItem[];
}

export default function CreatePlanPage() {
    const { draft, project, engineers, auth: { user } } = usePage<{ project: Project, engineers: User[], auth: Auth, draft: CreatePlanProp }>().props;
    const defaultProjectProp: CreatePlanProp = {
        name: project.name,
        icon: project.icon,
        engineer: user.role == 'encoder' ? engineers[0].id : user.id,
        planned_days: 50,
        items: [{
            name: "",
            id: 1,
            icon: 'hammer',
            planned_days: 5,
            quantity: 0,
            unit: "",
            materials: [
                {
                    name: "",
                    unit: "",
                    quantity: 5,
                    price: 50.0
                }
            ],
            laborers: [{
                role: "",
                quantity: 1,
                rate: 250
            }],
            prerequisites: [],
            equipment: [
                {
                    name: "",
                    quantity: 1,
                    rate: 250
                }
            ]
        }]
    }

    const form = useForm<CreatePlanProp>(draft ?? defaultProjectProp);

    return (
        <ScrollNavLayout heading={{
            title: "Project Plan",
            description: `Create plan for ${form.data.name}`,
        }}>
            <CreatePlanPageInner form={form} />
        </ScrollNavLayout>
    )
}

export function CreatePlanPageInner({ form }: { form: InertiaForm<CreatePlanProp> }) {
    const { scrollTo } = useScrollNav();
    const [mode, setMode] = useState<'card' | 'path' | string>('form')

    const { data, setData, errors, post } = form;

    const saveDraft = () => {
        post(drafts.store().url, {
            onSuccess: () => {
                toast.success("Saved to draft")
            },
            onBefore: () => {
                toast.loading("Saving to draft")
            }
        });
    }

    const saveProject = () => {
        post(plans.store().url, {
            onSuccess: () => {
                toast.success("Project saved");
            },
            onBefore: () => {
                toast.loading("Generating Project")
            },
            onError: () => {
                toast.error("Saving Failed")
            },
        })
    }

    const { sorted } = usePrerequisiteOrder<CreateWorkItem>(data.items);

    const addItem = () => {
        const id = data.items.length > 0 ? data.items.sort((a, b) => b.id - a.id)[0].id + 1 : 1
        setData('items', [...data.items, {
            name: '',
            id: data.items.length > 0 ? data.items.sort((a, b) => b.id - a.id)[0].id + 1 : 1,
            icon: 'hammer',
            planned_days: 5,
            quantity: 0,
            unit: "",
            materials: [{
                name: "",
                unit: "",
                quantity: 5,
                price: 20.0
            }],
            laborers: [{
                role: "",
                quantity: 1,
                rate: 250
            }],
            prerequisites: [],
            equipment: [{
                name: "",
                quantity: 1,
                rate: 250
            }]
        }])
        setTimeout(() => scrollTo(`item-card-${id}`), 0)
    }

    const updateItem = (id: number, field: keyof CreateWorkItem, value: CreateWorkItem[keyof CreateWorkItem]) => {
        setData('items',
            data.items.map((item, i) =>
                id === item.id ? { ...item, [field]: value } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setData('items',
            data.items.filter((item, i) =>
                id !== item.id
            ).map((item) => ({
                ...item,
                prerequisites: item.prerequisites.filter((p) => p !== id)
            }))
        );
    }

    const getItemErrors = (index: number) => {
        const prefix = `items.${index}.`
        return Object.fromEntries(
            Object.entries(errors)
                .filter(([key]) => key.startsWith(prefix))
                .map(([key, val]) => [key.replace(prefix, ''), val])
        ) as Partial<Record<keyof CreateWorkItem, string>>
    }

    const total_days = useMemo(() => {
        const finishMap = new Map<number, number>();

        function getFinish(id: number): number {
            if (finishMap.has(id)) return finishMap.get(id)!;

            const item = data.items.find(i => i.id === id)!;
            if (!item) return 0;

            const prereqMax = item.prerequisites.length > 0
                ? Math.max(...item.prerequisites.map(p => getFinish(Number(p))))
                : 0;

            const finish = prereqMax + Number(item.planned_days);
            finishMap.set(id, finish);
            return finish;
        }

        return Math.max(...data.items.map(item => getFinish(item.id)));
    }, [data.items]);

    useEffect(() => {
        setData('planned_days', total_days);
    }, [total_days]);

    return (
        <>
            <ScrollNavAside>
                <ScrollNavAsideHeader>
                    View
                </ScrollNavAsideHeader>
                <div onClick={() => setMode('form')}>
                    <ScrollNavAsideButton isActive={mode === 'form'}>
                        <TableIcon />
                        Form
                    </ScrollNavAsideButton>
                </div>
                <div onClick={() => setMode('path')}>
                    <ScrollNavAsideButton isActive={mode === 'path'}>
                        <WorkflowIcon />
                        Precedence Diagram
                    </ScrollNavAsideButton>
                </div>

                <ScrollNavAsideHeader>
                    Actions
                </ScrollNavAsideHeader>
                <div onClick={addItem}>
                    <ScrollNavAsideButton>
                        <Plus />
                        Add Item
                    </ScrollNavAsideButton>
                </div>
                <div onClick={saveDraft}>
                    <ScrollNavAsideButton>
                        <FileClock />
                        Save as Draft
                    </ScrollNavAsideButton>
                </div>
                <div onClick={saveProject}>
                    <ScrollNavAsideButton variant="default">
                        <Save />
                        Save Project
                    </ScrollNavAsideButton>
                </div>

                <DeveloperDraftJSON />

                {mode == 'form' && (
                    <>
                        <ScrollNavAsideHeader>
                            Navigation
                        </ScrollNavAsideHeader>
                        <ScrollNavAsideButton id="information">
                            <DynamicIcon name={data.icon} />
                            Information
                        </ScrollNavAsideButton>
                        <ScrollNavAsideButton id="gantt">
                            <DynamicIcon name={'gantt-chart'} />
                            Gantt Chart
                        </ScrollNavAsideButton>
                        {sorted.map((item) => {
                            return (
                                <ScrollNavAsideButton key={`item-card-${item.id}`} id={`item-card-${item.id}`}>
                                    <DynamicIcon name={item.icon} />
                                    {item.name ? item.name : 'Work Item ' + item.id}
                                </ScrollNavAsideButton>
                            )
                        })}
                    </>
                )}


            </ScrollNavAside>
            {mode == 'form' &&
                <ScrollNavContent>
                    <div className="font-bold">
                        Essentials
                    </div>
                    <ScrollNavItem id="information">
                        <ProjectEssentialsForm form={form} />
                    </ScrollNavItem>
                    <ScrollNavItem id="gantt">
                        <GanttChartPlanCard items={data.items} />
                    </ScrollNavItem>
                    <div className="font-bold">
                        Item of Works
                        <FieldError>
                            {errors.items}
                        </FieldError>
                    </div>
                    {sorted.map((item, index) => {
                        const originalIndex = data.items.findIndex(i => i.id === item.id)
                        return (
                            <ScrollNavItem id={`item-card-${item.id}`} key={item.id}>
                                <CreateWorkItemCard item={item} items={data.items} errors={getItemErrors(originalIndex)}
                                    onChange={(field, value) => updateItem(item.id, field, value)}
                                    onRemove={() => removeItem(item.id)}
                                />
                            </ScrollNavItem>
                        )
                    })}
                    <MaterialDatalist />
                </ScrollNavContent>
            }
            {mode === 'path' && <>
                <PlanPath items={data.items} />
            </>}
        </>
    )
}

CreatePlanPage.layout = {
    breadcrumbs: [
        {
            title: 'Project Plan',
            href: plans.create(),
        },
    ],
};
