import { Trash, Plus } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/input-group";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";
import { usePage } from "@inertiajs/react";
import { Material } from "@/types";
import InputError from "../input-error";

export type CreateMaterial = {
    name: string,
    quantity: number,
    unit: string,
    price: number
}

export default function CreateMaterialsTable({ materials, onChange }: {
    materials: CreateMaterial[],
    onChange: (materials: CreateMaterial[]) => void
}) {

    const { materials: materialList } = usePage<{ materials: Material[] }>().props;
    const addMaterial = () => {
        onChange([...materials, {
            name: "",
            quantity: 1,
            unit: "",
            price: 20
        }])
    }

    const materialExists = (material: string) => materialList.map(
        (material) => material.name
    ).includes(material)

    const updateMaterial = (index: number, field: keyof CreateMaterial, value: CreateMaterial[keyof CreateMaterial]): void => {
        if (field == 'name' && materialExists(value as CreateMaterial['name'])) {
            const material = materialList.filter((material) => material.name === value)[0];

            onChange(
                materials.map((item, i) =>
                    i === index ? {
                        ...item,
                        'name': material.name,
                        'unit': material.unit,
                        'price': material.price
                    } : item
                )
            )
        } else {
            onChange(
                materials.map((item, i) =>
                    i === index ? {
                        ...item,
                        [field]: value
                    } : item
                )
            )
        }
    }

    const deleteMaterial = (index: number) => {
        onChange(materials.filter((material, i) => index !== i))
    }

    const total = (
        materials.map(
            (laborer) => laborer.quantity * laborer.price
        ).reduce((acc, val) => acc + val, 0)
    )

    return (
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
                    <TableHead className="text-end">
                        Total
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {materials.map((material, index) => (
                    <ContextMenu>
                        <ContextMenuTrigger asChild>
                            <TableRow key={index} className="">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <TableCell colSpan={2}>
                                            <Input
                                                list="materials" className="h-7 border-none shadow-none"
                                                value={material.name} placeholder="ex. Steel Beams..."
                                                onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                                            />
                                            <InputError />
                                        </TableCell>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        {material.name ? material.name : 'Enter material name'} <br /> Right click to delete
                                    </TooltipContent>
                                </Tooltip>
                                <TableCell>
                                    <Input disabled={materialExists(material.name)} className="h-7 border-none shadow-none" value={material.unit} placeholder="pcs" onChange={(e) => updateMaterial(index, 'unit', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <Input value={material.quantity} className="h-7 border-none shadow-none" type="number" onChange={(e) => updateMaterial(index, 'quantity', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <InputGroup className="h-7 border-none shadow-none">
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
                                            {(material.quantity * material.price).toLocaleString('en-US', {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2
                                            })}
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
                <TableRow className="">
                    <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        Total
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        <div className="flex gap-2 justify-between">
                            <span>
                                &#8369;
                            </span>
                            <span className="font-mono">
                                {total.toLocaleString('en-US', {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })}
                            </span>
                        </div>
                    </TableCell>
                </TableRow>
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
    )
}
