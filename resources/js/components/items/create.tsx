import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Item, ItemActions, ItemContent, ItemMedia } from "../ui/item";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { IconPicker } from "../ui/icon-picker";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group";
import CreateMaterialsTable, { CreateMaterial } from "../materials/create-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CreateLaborersTable, { CreateLaborer } from "../laborers/create-table";
import CreatePrerequisitesTable from "./create-prerequisites-table";
import CreateEquipmentTable, { CreateEquipment } from "../equipment/create-table";
import ItemOverviewTable from "./overview-table";

export type CreateWorkItem = {
    id: number,
    name: string,
    icon: IconName,
    quantity: number,
    unit: string,
    planned_days: number,
    materials: CreateMaterial[],
    laborers: CreateLaborer[],
    prerequisites: CreateWorkItem['id'][];
    equipment: CreateEquipment[]
}

export type CreateWorkItemCardProps = {
    item: CreateWorkItem
    items: CreateWorkItem[]
    onChange: (field: keyof CreateWorkItem, value: CreateWorkItem[keyof CreateWorkItem]) => void
    onRemove: () => void
    errors: Partial<Record<keyof CreateWorkItem, string>>
}

export default function CreateWorkItemCard({ item, items, onChange, onRemove, errors }: CreateWorkItemCardProps) {
    return (
        <Card className="gap-4">
            <CardHeader>
                <Item className="p-0">
                    <IconPicker value={item.icon} onValueChange={(value) => onChange("icon", value)}>
                        <ItemMedia variant={'icon'}>
                            <DynamicIcon name={item.icon} />
                        </ItemMedia>
                    </IconPicker>
                    <ItemContent>
                        <CardTitle>
                            {item.name ? item.name : 'Work Item'}
                        </CardTitle>
                        <CardDescription>
                            Manage item info for {item.name ? item.name : 'work item here'}.
                        </CardDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button onClick={onRemove} variant={'secondary'}>
                            <Trash className="stroke-destructive" />
                        </Button>
                    </ItemActions>
                </Item>
            </CardHeader>
            <CardContent className="space-y-4">
                <Field className="grid grid-cols-3">
                    <Field className="col-span-2 gap-1">
                        <FieldLabel>
                            Name
                        </FieldLabel>
                        <Input name="name" value={item.name} placeholder="ex. Grounding, Flooring..."
                            onChange={e => onChange('name', e.target.value)} />
                        <FieldError>
                            {errors.name}
                        </FieldError>
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel>
                            Days to Completion
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput name="planned_days" type="number" value={item.planned_days} placeholder="6"
                                onChange={e => onChange('planned_days', e.target.valueAsNumber)} />
                            <InputGroupAddon align={'inline-end'}>
                                <InputGroupText>days</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>
                            {errors.planned_days}
                        </FieldError>
                    </Field>
                    <Field className="col-span-1 gap-1">
                        <FieldLabel>
                            Quantity <span className="text-muted-foreground">(Area of Completion)</span>
                        </FieldLabel>
                        <Input type="number" value={item.quantity} placeholder="Enter number"
                            onChange={e => onChange('quantity', e.target.valueAsNumber)} />
                        <FieldError>
                            {errors.name}
                        </FieldError>
                    </Field>
                    <Field className="col-span-2 gap-1">
                        <FieldLabel>
                            Unit
                        </FieldLabel>
                        <Input value={item.unit} placeholder="ex. Square Meter, Cubic Meter..."
                            onChange={e => onChange('unit', e.target.value)} />
                        <FieldError>
                            {errors.name}
                        </FieldError>
                    </Field>
                </Field>
                <Tabs defaultValue="materials">
                    <TabsList>
                        <TabsTrigger value="materials">Materials</TabsTrigger>
                        <TabsTrigger value="laborers">Labor</TabsTrigger>
                        <TabsTrigger value="equipment">Equipment</TabsTrigger>
                        <TabsTrigger value="prerequisites">Precedings</TabsTrigger>
                        <TabsTrigger value="summary">Overview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="materials">
                        <Field>
                            <CreateMaterialsTable
                                materials={item.materials}
                                onChange={(materials) => onChange('materials', materials)}
                            />
                        </Field>
                    </TabsContent>
                    <TabsContent value="laborers">
                        <Field>
                            <CreateLaborersTable
                                laborers={item.laborers}
                                onChange={(laborers) => onChange('laborers', laborers)}
                            />
                        </Field>
                    </TabsContent>
                    <TabsContent value="prerequisites" className="">
                        <Field>
                            <CreatePrerequisitesTable
                                id={item.id}
                                prerequisites={item.prerequisites}
                                items={items}
                                onChange={(prerequisites) => onChange('prerequisites', prerequisites)}
                            />
                        </Field>
                    </TabsContent>
                    <TabsContent value="equipment">
                        <Field>
                            <CreateEquipmentTable
                                equipment={item.equipment}
                                onChange={(equipment) => onChange('equipment', equipment)}
                            />
                        </Field>
                    </TabsContent>
                    <TabsContent value="summary">
                        <ItemOverviewTable item={item} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
