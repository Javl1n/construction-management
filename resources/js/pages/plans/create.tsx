import CardSection from "@/components/card-section";
import Heading from "@/components/heading";
import CreateWorkItemCard, { CreateWorkItem } from "@/components/items/create";
import CreateLaborersCard, { CreateLaborer } from "@/components/laborers/create";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import items from "@/routes/items";
import { Project } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { Hammer, Plus, Scan, Users } from "lucide-react";
import { useRef, useState } from "react";

export type CreatePlanProp = {
    laborers: CreateLaborer[]
    items: CreateWorkItem[]
}

export default function CreateItemsPage() {
    const { open } = useSidebar();
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
        );
    };

    const removeItem = (index: number) => {
        setData('items',
            data.items.filter((item, i) =>
                i !== index
            )
        );
    }

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState('labor');

    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
        labor: null,
    });

    const scrollTo = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
    }

    const registerRef = (id: string, el: HTMLDivElement | null) => {
        if (el) sectionRefs.current[id] = el;
        else delete sectionRefs.current[id];
    }

    return (
        <div className="px-4 pt-6">
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
                            onClick={() => scrollTo('labor')}
                            asChild
                            className={cn('w-full justify-start', {
                                'bg-muted': 'labor' === active
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
                                onClick={() => scrollTo(`item-card-${index}`)}
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': `item-card-${index}` === active
                                })}
                            >
                                <div >
                                    <div className="h-4 w-4">
                                        <Scan size={42}>
                                            <Hammer size={15} x={5} y={5} />
                                        </Scan>
                                    </div>
                                    {item.name ? item.name : 'New Work Item'}
                                </div>
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

                <ScrollArea
                    ref={scrollContainerRef}
                    className={cn([
                        "flex-1",
                        !open && "md:max-h-[calc(100vh-9.6rem)]",
                        open && "md:max-h-[calc(100vh-10.6rem)]",
                    ])}>
                    <section className="space-y-6 w-xl pb-6">
                        <CardSection
                            id="labor"
                            onInView={setActive}
                            registerRef={registerRef}
                            scrollContainer={scrollContainerRef.current}
                        >
                            <CreateLaborersCard form={form} />
                        </CardSection>
                        {data.items.map((item, i) => (
                            <CardSection
                                key={`item-card-${i}`}
                                id={`item-card-${i}`}
                                onInView={setActive}
                                registerRef={registerRef}
                                scrollContainer={scrollContainerRef.current}
                            >
                                <CreateWorkItemCard item={item}
                                    onChange={(field, value) => updateItem(i, field, value)}
                                    onRemove={() => removeItem(i)} />
                            </CardSection>
                        ))}
                    </section>
                </ScrollArea>
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
