import { usePlanContext } from "@/pages/plans/create";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { CreateWorkItem } from "./create";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";

export default function CreatePrerequisitesTable({ id, prerequisites, onChange, items }: {
    prerequisites: CreateWorkItem['prerequisites']
    items: CreateWorkItem[]
    onChange: (prerequisites: CreateWorkItem['prerequisites']) => void
    id: CreateWorkItem['id']
}) {

    const addItem = () => {
        onChange([
            ...prerequisites,
            items[0].id
        ])
    }

    const updateItem = (index: number, value: string) => {
        onChange(
            prerequisites.map((item, i) =>
                i === index ? parseInt(value) : item
            )
        )
    }

    const deleteItem = (index: number) => {
        onChange(
            prerequisites.filter((item, i) =>
                i !== index
            )
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={2}>Prerequisites</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {prerequisites.map((prerequisite, index) => (
                    <TableRow key={index}>
                        <TableCell className="w-full">
                            <Select
                                value={prerequisite.toString()}
                                onValueChange={(value) => updateItem(index, value)}
                            >
                                <SelectTrigger className="border-none shadow-none w-full">
                                    <SelectValue placeholder="Select Item" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Items</SelectLabel>
                                        {items.filter((i) => i.id !== id).map((item, index) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name ? item.name : `Work Item ${item.id}`}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="flex justify-end">
                            <Button onClick={() => deleteItem(index)} className="text-destructive" size={'sm'} variant={'outline'}>
                                <Trash />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow className="w-full">
                    <TableCell className="w-full" colSpan={2} onClick={() => addItem()}>
                        <span className="flex gap-2">
                            <Plus className="h-4 w-4 my-auto" />
                            Add Item
                        </span>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
