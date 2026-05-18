import { CreatePlanProp } from "@/pages/plans/create";
import { InertiaFormProps } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Item, ItemContent, ItemMedia } from "../ui/item";
import CreateLaborersTable from "./create-table";

export default function CreateLaborersCard({ form }: { form: InertiaFormProps<CreatePlanProp> }) {
    const { data, setData } = form;


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
                {/* <CreateLaborersTable */}
                {/*     laborers={data.laborers} */}
                {/*     onChange={(laborers) => setData('laborers', laborers)} */}
                {/* /> */}
            </CardContent>
        </Card>
    )
}
