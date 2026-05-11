import Heading from "@/components/heading";
import CreateWorkItemCard, { CreateWorkItem } from "@/components/items/create";
import CreateLaborersCard, { CreateLaborer } from "@/components/laborers/create";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrentUrl } from "@/hooks/use-current-url";
import { cn, toUrl } from "@/lib/utils";
import items from "@/routes/items";
import { Project } from "@/types";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Hammer, Plus, Scan, Users } from "lucide-react";
import { PropsWithChildren } from "react";

export type CreatePlanProp = {
    laborers: CreateLaborer[]
    items: CreateWorkItem[]
}

export default function CreateItemsPage() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { project } = usePage<{ project: Project }>().props;


    const form = useForm<CreatePlanProp>({
        laborers: [{
            role: "",
            quantity: 1,
            rate: 250
        }],
        items: [{
            name: "Cementing",
            order: 0,
            planned_days: 5,
        }]
    });

    const { data, setData } = form;

    const addItem = () => {
        setData('items', [...data.items, {
            name: '',
            order: data.items.length + 1,
            planned_days: 5,
        }])
    }

    const updateItem = (index: number, field: keyof CreateWorkItem, value: CreateWorkItem[keyof CreateWorkItem]) => {
        setData('items',
            data.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        )
    };


    return (
        <div className="px-4 py-6">
            <Heading
                title="Project Plan"
                description={`Create plan for ${project.name}`}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className={cn('w-full justify-start', {
                                'bg-muted': false
                            })}
                        >
                            <div className="">
                                <Users className="h-4 w-4" />
                                Labor
                            </div>
                        </Button>
                        {data.items.map((item, index) => (
                            <Button
                                key={`item-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': false
                                })}
                            >
                                <Link href={'#'}>
                                    <div className="h-4 w-4">
                                        <Scan size={42}>
                                            <Hammer size={15} x={5} y={5} />
                                        </Scan>
                                    </div>
                                    {item.name ? item.name : 'New Work Item'}
                                </Link>
                            </Button>
                        ))}
                        <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className={cn('w-full justify-start', {
                                'bg-muted': false
                            })}
                            onClick={addItem}
                        >
                            <div>
                                <div className="h-4 w-4">
                                    <Scan size={42}>
                                        <Plus size={18} x={3} y={3} />
                                    </Scan>
                                </div>
                                Add Work
                            </div>
                        </Button>
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-6">
                        <CreateLaborersCard form={form} />
                        {data.items.map((item, i) => (
                            <CreateWorkItemCard key={`item-card-${i}`} item={item}
                                onChange={(field, value) => updateItem(i, field, value)}
                                onRemove={() => null} />
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}

CreateItemsPage.layout = {
    breadcrumbs: [
        {
            title: 'Project Plan',
            href: items.create(),
        },
    ],
};
