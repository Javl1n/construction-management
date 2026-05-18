import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Trash, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Worker } from "@/types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export type CreateLaborer = {
    role: Worker['role']
    quantity: Worker['quantity']
    rate: Worker['rate']
}

export default function CreateLaborersTable({ laborers, onChange }: {
    laborers: CreateLaborer[],
    onChange: (laborers: CreateLaborer[]) => void
}) {
    const addLabor = () => {
        onChange([...laborers, {
            role: '',
            quantity: 1,
            rate: 250.00
        }])
    }

    const updateLaborer = (index: number, field: keyof CreateLaborer, value: CreateLaborer[keyof CreateLaborer]): void => {
        onChange(
            laborers.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        )
    }

    const deleteLaborer = (index: number) => {
        onChange(
            laborers.filter((item, i) =>
                i !== index
            )
        )
    }

    const total = (
        laborers.map(
            (laborer) => laborer.quantity * laborer.rate
        ).reduce((acc, val) => acc + val, 0)
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Role</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="">Rate (per day)</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {laborers.map((laborer, index) => (
                    <ContextMenu key={index}>
                        <ContextMenuTrigger asChild>
                            <TableRow>
                                <TableCell>
                                    <Input placeholder="ex. Labor" value={laborer.role}
                                        className="border-0 h-7 shadow-none"
                                        onChange={e => updateLaborer(index, 'role', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <Input value={laborer.quantity} type="number"
                                        className="border-0 h-7 shadow-none"
                                        onChange={e => updateLaborer(index, 'quantity', parseInt(e.target.value))} />
                                </TableCell>
                                <TableCell>
                                    <InputGroup className="h-7 border-none shadow-none">
                                        <InputGroupInput value={laborer.rate} type="number"
                                            className="border-0 h-7 shadow-none"
                                            onChange={e => updateLaborer(index, 'rate', parseFloat(e.target.value))} />
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
                                            {(laborer.quantity * laborer.rate).toLocaleString('en-US', {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={() => deleteLaborer(index)}>
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
                <TableRow onClick={addLabor} className="">
                    <TableCell colSpan={4} className="font-bold">
                        <span className="flex gap-2">
                            <Plus className="h-4 w-4 my-auto" />
                            Add Labor
                        </span>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
