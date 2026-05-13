import CreateWorkItemCard, { CreateWorkItem } from "@/components/items/create";
import CreateLaborersCard, { CreateLaborer } from "@/components/laborers/create";
import { MaterialDatalist } from "@/components/materials/datalist";
import { SortableList, SortableListItem, useSortableList } from "@/components/sortable";
import { ScrollNavAside, ScrollNavAsideButton, ScrollNavContent, ScrollNavItem, ScrollNavLayout } from "@/layouts/scroll-nav-layout";
import items from "@/routes/items";
import { Project } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { Plus, Users } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export type CreatePlanProp = {
    laborers: CreateLaborer[]
    items: CreateWorkItem[]
}

export default function CreatePlanPage() {
    const { project } = usePage<{ project: Project }>().props;

    const form = useForm<CreatePlanProp>({
        laborers: [{
            role: "",
            quantity: 1,
            rate: 250
        }],
        items: [{
            name: "Cementing",
            id: 0,
            icon: 'hammer',
            planned_days: 5,
            materials: [
                {
                    name: "",
                    unit: "",
                    quantity: 5,
                    price: 50.0
                }
            ]
        }]
    });

    const { data, setData, errors, post } = form;

    const [items, setItems] = useSortableList(data.items);

    const addItem = () => {
        setData('items', [...data.items, {
            name: '',
            id: data.items.length > 0 ? data.items.sort((a, b) => b.id - a.id)[0].id + 1 : 0,
            icon: 'hammer',
            planned_days: 5,
            materials: []
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
            )
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

    return (
        <ScrollNavLayout heading={{
            title: "Project Plan",
            description: `Create plan for ${project.name}`,
        }}>
            <ScrollNavAside>
                <ScrollNavAsideButton id="labor">
                    <Users />
                    Labor
                </ScrollNavAsideButton>
                {items.map((item, index) => {
                    {/* const item = data.items.filter(item => item.id == localItem.id)[0] */ }
                    return (
                        <ScrollNavAsideButton key={`item-card-${index}`} id={`item-card-${index}`}>
                            <DynamicIcon name={item.icon} />
                            {item.name ? item.name : 'New Work Item'}
                        </ScrollNavAsideButton>
                    )
                })}
                <div onClick={addItem}>
                    <ScrollNavAsideButton>
                        <Plus />
                        Add Item
                    </ScrollNavAsideButton>
                </div>
            </ScrollNavAside>
            <ScrollNavContent>
                <div className="font-bold">
                    Essentials
                </div>
                <ScrollNavItem id="labor">
                    <CreateLaborersCard form={form} />
                </ScrollNavItem>
                <div className="font-bold">
                    Item of Works
                </div>
                <SortableList items={items} onMove={setItems}>
                    {data.items.map((item, index) => (
                        <SortableListItem id={item.id} index={index} key={`item-card-${index}`}>
                            <ScrollNavItem id={`item-card-${index}`}>
                                <CreateWorkItemCard item={item} errors={getItemErrors(index)}
                                    onChange={(field, value) => updateItem(item.id, field, value)}
                                    onRemove={() => removeItem(item.id)}
                                />
                            </ScrollNavItem>
                        </SortableListItem>
                    ))}
                </SortableList>
                <MaterialDatalist />
            </ScrollNavContent>
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
