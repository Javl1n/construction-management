import { CreatePlanProp } from "@/pages/plans/create";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";


export type CreateWorkItem = {
    name: string,
    order: number,
    planned_days: number,
}

export type CreateWorkItemCardProps = {
    item: CreateWorkItem
    onChange: (field: keyof CreateWorkItem, value: CreateWorkItem[keyof CreateWorkItem]) => void
    onRemove: () => void
}

export default function CreateWorkItemCard({ item, onChange, onRemove }: CreateWorkItemCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {item.name ? item.name : 'New Work Item'}
                </CardTitle>
                <CardDescription>
                    Manage work item and it's materials here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Field>
                    <FieldLabel>
                        Name
                    </FieldLabel>
                    <Input name="name" value={item.name} onChange={e => onChange('name', e.target.value)} />
                </Field>
            </CardContent>
        </Card>
    )
}
