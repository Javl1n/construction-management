import { FileText, FormInput } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from "../ui/item";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InertiaFormProps, usePage } from "@inertiajs/react";
import { CreatePlanProp } from "@/pages/plans/create";
import { IconPicker } from "../ui/icon-picker";
import { DynamicIcon } from "lucide-react/dynamic";
import { Auth, User } from "@/types";
import EngineerCombobox from "../engineers/combobox";
import SelectEngineer from "../engineers/select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { CreateWorkItem } from "../items/create";

export default function ProjectEssentialsForm({ form: { data, setData } }: { form: InertiaFormProps<CreatePlanProp> }) {
    // const labor_cost = (
    //     data.laborers.map(
    //         (laborer) => laborer.quantity * laborer.rate
    //     ).reduce((acc, val) => acc + val, 0)
    //     * data.planned_days
    // )

    const itemTotal = (item: CreateWorkItem) => {
        const materialCost = (
            item.materials.map(
                (material) => material.quantity * material.price
            ).reduce((acc, val) => acc + val, 0)
        )

        const laborCost = (
            item.laborers.map(
                (laborer) => laborer.quantity * laborer.rate
            ).reduce((acc, val) => acc + val, 0)
        )

        const equipmentCost = (
            item.equipment.map(
                (equipment) => equipment.quantity * equipment.rate
            ).reduce((acc, val) => acc + val, 0)
        )

        return materialCost + laborCost + equipmentCost;
    }

    const total = (
        data.items.map((item) => itemTotal(item))
            .reduce((acc, val) => acc + val, 0)
    )

    return (
        <Card>
            <CardHeader>
                <Item className="p-0">
                    <IconPicker value={data.icon} onValueChange={(value) => setData("icon", value)}>
                        <ItemMedia variant={'icon'}>
                            <DynamicIcon name={data.icon} />
                        </ItemMedia>
                    </IconPicker>
                    <ItemContent>
                        <CardTitle>
                            Information
                        </CardTitle>
                        <CardDescription>
                            Manage Project Information.
                        </CardDescription>
                    </ItemContent>
                </Item>
            </CardHeader>
            <CardContent className="space-y-2">
                <Field className="gap-1">
                    <FieldLabel>
                        Project Name
                    </FieldLabel>
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </Field>
                <Field className="grid grid-cols-3">
                    <Field className="gap-1">
                        <FieldLabel>
                            Days to Completion
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                type="number" value={data.planned_days} readOnly
                                onChange={(e) => setData('planned_days', parseInt(e.target.value))}
                            />
                            <InputGroupAddon align={'inline-end'}>
                                <InputGroupText>days</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <Field className="col-span-2 gap-1">
                        <FieldLabel>
                            Engineer
                        </FieldLabel>
                        <SelectEngineer value={data.engineer} onChange={(value) => setData('engineer', value)} />
                    </Field>
                </Field>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-full">
                                Item
                            </TableHead>
                            <TableHead className="text-center">
                                Duration
                            </TableHead>
                            <TableHead className="text-end">
                                Cost
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-full">
                                    {item.name ? item.name : `Work Item ${item.id}`}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.planned_days}d
                                </TableCell>
                                <TableCell className="text-end">
                                    <div className="flex gap-2 justify-between">
                                        <span>
                                            &#8369;
                                        </span>
                                        <span className="font-mono">
                                            {(itemTotal(item)).toLocaleString('en-US', {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={1}>
                                Total
                            </TableCell>
                            <TableCell className="text-center">
                                {data.planned_days}d
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2 justify-between font-bold">
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
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    )
}
