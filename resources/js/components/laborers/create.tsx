import { CreatePlanProp } from "@/pages/plans/create";
import { InertiaFormProps } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Trash, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from "../ui/item";

export type CreateLaborer = {
    role: string
    quantity: number
    rate: number
}

export default function CreateLaborersCard({ form }: { form: InertiaFormProps<CreatePlanProp> }) {
    const { data, setData } = form;

    const addLabor = () => {
        setData('laborers', [...data.laborers, {
            role: '',
            quantity: 1,
            rate: 250.00
        }])
    }

    const updateLaborer = (index: number, field: keyof CreateLaborer, value: CreateLaborer[keyof CreateLaborer]): void => {
        setData('laborers',
            data.laborers.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        )
    }

    return (
        <Card className="gap-2">
            <CardHeader>
                <Item className="p-0">
                    <ItemMedia variant={'icon'}>
                        <Users />
                    </ItemMedia>
                    <ItemContent>
                        <CardTitle>
                            Laborers
                        </CardTitle>
                        <CardDescription>
                            Manage Laborers and their roles here.
                        </CardDescription>
                    </ItemContent>
                </Item>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Role</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="">Rate (per day)</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.laborers.map((laborer, index) => (
                            <TableRow key={`laborer-${index}`}>
                                <TableCell>
                                    <Input placeholder="Labor" value={laborer.role}
                                        onChange={e => updateLaborer(index, 'role', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <Input value={laborer.quantity} type="number"
                                        onChange={e => updateLaborer(index, 'quantity', parseInt(e.target.value))} />
                                </TableCell>
                                <TableCell>
                                    <Input value={laborer.rate} type="number"
                                        onChange={e => updateLaborer(index, 'rate', parseFloat(e.target.value))} />
                                </TableCell>
                                <TableCell>
                                    <Button variant={'secondary'} onClick={() => setData('laborers',
                                        data.laborers.filter((item, i) =>
                                            i !== index
                                        )
                                    )}>
                                        <Trash className="stroke-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
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
            </CardContent>
        </Card>
    )
}
