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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function ProjectEssentialsForm({ form }: { form: InertiaFormProps<CreatePlanProp> }) {
    const { data, setData } = form;
    // const labor_cost = (
    //     data.laborers.map(
    //         (laborer) => laborer.quantity * laborer.rate
    //     ).reduce((acc, val) => acc + val, 0)
    //     * data.planned_days
    // )

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
                                type="number" value={data.planned_days}
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
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead className="text-end">
                                Cost
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* <TableRow> */}
                        {/*     <TableCell className="font-bold"> */}
                        {/*         Labor */}
                        {/*     </TableCell> */}
                        {/*     <TableCell className="text-end text-muted-foreground font-mono text-xs"> */}
                        {/*         {(labor_cost.toLocaleString('en-US', { */}
                        {/*             minimumFractionDigits: 2, maximumFractionDigits: 2 */}
                        {/*         }))} */}
                        {/*     </TableCell> */}
                        {/* </TableRow> */}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
