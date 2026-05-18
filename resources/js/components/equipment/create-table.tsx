import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Trash, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Worker } from "@/types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Equipment } from "@/types"

export type CreateEquipment = {
    name: Equipment['name']
    quantity: Equipment['quantity']
    rate: Equipment['rate']
}

export default function CreateEquipmentTable({ equipment, onChange }: {
    equipment: CreateEquipment[],
    onChange: (equipment: CreateEquipment[]) => void
}) {
    const addEquipment = () => {
        onChange([...equipment, {
            name: '',
            quantity: 1,
            rate: 250.00
        }])
    }

    const updateEquipment = (index: number, field: keyof CreateEquipment, value: CreateEquipment[keyof CreateEquipment]): void => {
        onChange(
            equipment.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        )
    }

    const deleteEquipment = (index: number) => {
        onChange(
            equipment.filter((item, i) =>
                i !== index
            )
        )
    }

    const total = (
        equipment.map(
            (equipment) => equipment.quantity * equipment.rate
        ).reduce((acc, val) => acc + val, 0)
    )
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Equipment</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="">Rate (per day)</TableHead>
                    <TableHead className="text-end">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {equipment.map((equipment, index) => (
                    <ContextMenu key={index}>
                        <ContextMenuTrigger asChild>
                            <TableRow>
                                <TableCell>
                                    <Input placeholder="ex. Backhoe" value={equipment.name}
                                        className="border-0 h-7 shadow-none"
                                        onChange={e => updateEquipment(index, 'name', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <Input value={equipment.quantity} type="number"
                                        className="border-0 h-7 shadow-none"
                                        onChange={e => updateEquipment(index, 'quantity', parseInt(e.target.value))} />
                                </TableCell>
                                <TableCell>
                                    <InputGroup className="h-7 border-none shadow-none">
                                        <InputGroupInput value={equipment.rate} type="number"
                                            className="border-0 h-7 shadow-none"
                                            onChange={e => updateEquipment(index, 'rate', parseFloat(e.target.value))} />
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
                                            {(equipment.quantity * equipment.rate).toLocaleString('en-US', {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={() => deleteEquipment(index)}>
                                <Trash className="stroke-destructive" />
                                Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
                <TableRow className="">
                    <TableCell colSpan={3} className="text-sm text-muted-foreground">
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
                <TableRow onClick={addEquipment} className="">
                    <TableCell colSpan={4} className="font-bold">
                        <span className="flex gap-2">
                            <Plus className="h-4 w-4 my-auto" />
                            Add Equipment
                        </span>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
