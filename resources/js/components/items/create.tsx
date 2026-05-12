import { CreatePlanProp } from "@/pages/plans/create";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Hammer, Scan, Trash, Users } from "lucide-react";
import { Button } from "../ui/button";


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
        <Card className="gap-4">
            <CardHeader>
                <Item className="p-0">
                    <ItemMedia variant={'icon'}>
                        <Scan size={60}>
                            <Hammer size={15} x={5} y={5} />
                        </Scan>
                    </ItemMedia>
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
            <CardContent>
                <Field>
                    <FieldLabel>
                        Name
                    </FieldLabel>
                    <Input name="name" value={item.name} placeholder="Grounding"
                        onChange={e => onChange('name', e.target.value)} />
                </Field>
            </CardContent>
        </Card>
    )
}
