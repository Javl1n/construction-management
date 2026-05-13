import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Item, ItemActions, ItemContent, ItemMedia } from "../ui/item";
import { PhilippinePeso, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { IconPicker } from "../ui/icon-picker";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import MaterialCombobox from "../materials/combobox";
import { ChangeEvent } from "react";
import { usePage } from "@inertiajs/react";
import { Material } from "@/types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

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
    const { materials } = usePage<{ materials: Material[] }>().props;
    const addMaterial = () => {
        onChange("materials", [...item.materials, {
            name: "",
            quantity: 1,
            unit: "",
            price: 20
        }])
    }

    const updateMaterial = (index: number, field: keyof CreateMaterial, value: CreateMaterial[keyof CreateMaterial]): void => {
        if (field == 'name' && materialExists(value as CreateMaterial['name'])) {
            const material = materials.filter((material) => material.name === value)[0];

            onChange('materials',
                item.materials.map((item, i) =>
                    i === index ? {
                        ...item,
                        'name': material.name,
                        'unit': material.unit,
                        'price': material.price
                    } : item
                )
            )
        } else {
            onChange('materials',
                item.materials.map((item, i) =>
                    i === index ? {
                        ...item,
                        [field]: value
                    } : item
                )
            )
        }

    }

    const deleteMaterial = (index: number) => {
        onChange('materials', item.materials.filter((material, i) => index !== i))
    }

    const materialExists = (material: string) => materials.map((material) => material.name).includes(material)

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
                                <TableHead colSpan={2} className="w-50">
                                    Material
                                </TableHead>
                                <TableHead className="md:w-30">
                                    Unit
                                </TableHead>
                                <TableHead className="md:w-25">
                                    Quantity
                                </TableHead>
                                <TableHead className="md:w-30">
                                    Price
                                </TableHead>
                                <TableHead className="text-center">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {item.materials.map((material, index) => (
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <TableRow key={index} className="">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableCell colSpan={2}>
                                                        <Input list="materials" className="h-7 border-none" value={material.name} placeholder="Steel Beams" onChange={(e) => updateMaterial(index, 'name', e.target.value)} />
                                                        {/* <MaterialCombobox value={material.name} onValueChange={(value) => updateMaterial(index, 'name', value ?? '')} /> */}
                                                    </TableCell>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    {material.name ? material.name : 'Enter material name'} <br /> Right click to delete
                                                </TooltipContent>
                                            </Tooltip>
                                            <TableCell>
                                                <Input disabled={materialExists(material.name)} className="h-7 border-none" value={material.unit} placeholder="pcs" onChange={(e) => updateMaterial(index, 'unit', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <Input value={material.quantity} className="h-7 border-none" type="number" onChange={(e) => updateMaterial(index, 'quantity', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <InputGroup className="h-7 border-none">
                                                    <InputGroupInput disabled={materialExists(material.name)} className="h-6" value={material.price} type="number" onChange={(e) => updateMaterial(index, 'price', e.target.value)} />
                                                    <InputGroupAddon>
                                                        &#8369;
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <div className="flex gap-2 justify-between">
                                                    <span>
                                                        &#8369;
                                                    </span>
                                                    <span className="font-mono">
                                                        {(material.quantity * material.price).toFixed(2)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem variant="destructive" onClick={() => deleteMaterial(index)}>
                                            <Trash />
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow onClick={addMaterial} className="cursor-default">
                                <TableCell colSpan={6} className="font-bold">
                                    <span className="flex gap-2">
                                        <Plus className="h-4 w-4 my-auto" />
                                        Add Material
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Field>
            </CardContent>
        </Card>
    )
}
