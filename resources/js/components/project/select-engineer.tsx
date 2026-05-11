import { InertiaFormProps, usePage } from "@inertiajs/react";
import { CreateProjectType } from "./create-dialog";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Auth } from "@/types";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

export default function SelectEngineer({ form }: { form: InertiaFormProps<CreateProjectType> }) {
    const { auth: { user } } = usePage<{ auth: Auth }>().props;

    const { data, setData, errors } = form

    return (
        <Field className='gap-2'>
            <FieldLabel htmlFor="name">
                Engineer
            </FieldLabel>
            <Input
                disabled={user.role !== 'encoder'}
                id="engineer" name="engineer" placeholder="Camella Construction Project 1" value={data.engineer}
                onChange={e => setData('engineer', e.target.value)} />
            <Select>

            </Select>
            <FieldError>
                {errors.name}
            </FieldError>
        </Field>

    )
}
