import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Item, ItemActions, ItemContent, ItemMedia } from "../ui/item";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { IconPicker } from "../ui/icon-picker";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";

export type CreateMaterial = {
    name: string,
    quantity: number,
    unit: string,
    price: number
}

export type CreateWorkItem = {
    id: number,
    name: string,
    icon: IconName,
    planned_days: number,
    materials: CreateMaterial[]
}

export type CreateWorkItemCardProps = {
    item: CreateWorkItem
    onChange: (field: keyof CreateWorkItem, value: CreateWorkItem[keyof CreateWorkItem]) => void
    onRemove: () => void
    errors: Partial<Record<keyof CreateWorkItem, string>>
}

export default function CreateWorkItemCard({ item, onChange, onRemove, errors }: CreateWorkItemCardProps) {
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
                            {item.name ? item.name : 'New Work Item'}
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
                        <Input name="name" value={item.name} placeholder="Grounding"
                            onChange={e => onChange('name', e.target.value)} />
                        <FieldError>
                            {errors.name}
                        </FieldError>
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel>
                            Days to Completion
                        </FieldLabel>
                        <Input name="planned_days" type="number" value={item.planned_days} placeholder="6"
                            onChange={e => onChange('planned_days', e.target.value)} />
                        <FieldError>
                            {errors.planned_days}
                        </FieldError>
                    </Field>
                </Field>
                <Field>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Material
                                </TableHead>
                                <TableHead>
                                    Quantity
                                </TableHead>
                                <TableHead>
                                    Unit
                                </TableHead>
                                <TableHead>
                                    Price (per unit)
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </Field>
            </CardContent>
        </Card>
    )
}
