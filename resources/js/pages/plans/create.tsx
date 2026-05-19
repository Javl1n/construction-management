import CreateWorkItemCard, { CreateWorkItem } from "@/components/items/create";
import { MaterialDatalist } from "@/components/materials/datalist";
import { PlanPath } from "@/components/plans/path";
import ProjectEssentialsForm from "@/components/project/essentials-form";
import { SortableList, SortableListItem, useSortableList } from "@/components/sortable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollNavAside, ScrollNavAsideButton, ScrollNavAsideHeader, ScrollNavContent, ScrollNavItem, ScrollNavLayout } from "@/layouts/scroll-nav-layout";
import drafts from "@/routes/drafts";
import items from "@/routes/items";
import { Auth, Project, User } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { ChartGanttIcon, FileClock, FormInputIcon, LucideWalletCards, Plus, TableIcon, Users, WorkflowIcon } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { parse } from "path";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CreatePlanProp = {
    name: Project['name'];
    icon: Project['icon'];
    engineer: User['id'];
    planned_days: number;
    items: CreateWorkItem[];
}

const PlanFormContext = createContext<CreatePlanProp | null>(null);

export function usePlanContext(): CreatePlanProp {
    const ctx = useContext(PlanFormContext);
    if (!ctx) throw new Error('usePlanContext must be used inside PlanProvider')
    return ctx
}

export default function CreatePlanPage() {
    const { draft, project, engineers, auth: { user } } = usePage<{ project: Project, engineers: User[], auth: Auth, draft: CreatePlanProp }>().props;

    const [mode, setMode] = useState<'card' | 'path' | string>('form')

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

    const { data, setData, errors, post } = form;

    const saveDraft = () => {
        post(drafts.store().url, {
            onBefore: () => console.log("initialized"),
            onSuccess: () => console.log('saved to drafts')
        });
    }

    const addItem = () => {
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
        <ScrollNavLayout heading={{
            title: "Project Plan",
            description: `Create plan for ${data.name}`,
        }}>
            <ScrollNavAside>
                <ScrollNavAsideHeader>
                    Navigation
                </ScrollNavAsideHeader>
                <ScrollNavAsideButton id="information">
                    <DynamicIcon name={data.icon} />
                    Information
                </ScrollNavAsideButton>
                {data.items.map((item, index) => {
                    {/* const item = data.items.filter(item => item.id == localItem.id)[0] */ }
                    return (
                        <ScrollNavAsideButton key={`item-card-${index}`} id={`item-card-${index}`}>
                            <DynamicIcon name={item.icon} />
                            {item.name ? item.name : 'Work Item ' + item.id}
                        </ScrollNavAsideButton>
                    )
                })}

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
            </ScrollNavAside>
            {mode == 'form' &&
                <ScrollNavContent>
                    <div className="font-bold">
                        Essentials
                    </div>
                    <ScrollNavItem id="information">
                        <ProjectEssentialsForm form={form} />
                    </ScrollNavItem>
                    <div className="font-bold">
                        Item of Works
                    </div>
                    {data.items.map((item, index) => (
                        <ScrollNavItem id={`item-card-${index}`} key={index}>
                            <CreateWorkItemCard item={item} items={data.items} errors={getItemErrors(index)}
                                onChange={(field, value) => updateItem(item.id, field, value)}
                                onRemove={() => removeItem(item.id)}
                            />
                        </ScrollNavItem>
                    ))}
                    <MaterialDatalist />
                </ScrollNavContent>
            }
            {mode === 'path' && <>
                <PlanPath items={data.items} />
            </>}
        </ScrollNavLayout >
    )
}

CreatePlanPage.layout = {
    breadcrumbs: [
        {
            title: 'Project Plan',
            href: items.create(),
        },
    ],
};
