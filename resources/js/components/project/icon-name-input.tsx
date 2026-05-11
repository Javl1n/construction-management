import { InertiaFormProps } from "@inertiajs/react";
import { CreateProjectType } from "./create-dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { DynamicIcon } from "lucide-react/dynamic";
import { Button } from "../ui/button";
import { IconPicker } from "../ui/icon-picker";
import { Input } from "../ui/input";

export default function IconNameField({ form }: { form: InertiaFormProps<CreateProjectType> }) {
    const { data, setData, errors } = form

    return (
        <Field className='gap-2'>
            <FieldLabel htmlFor="name">
                Project Name
            </FieldLabel>
            <div className='flex gap-2'>
                <IconPicker value={data.icon} onValueChange={(value) => setData('icon', value)} categorized={false}>
                    <Button variant={'outline'}>
                        <DynamicIcon name={data.icon} />
                    </Button>
                </IconPicker>
                <Input id="name" name="name" placeholder="Camella Construction Project 1" value={data.name} onChange={e => setData('name', e.target.value)} />
            </div>
            <FieldError>
                {errors.name}
            </FieldError>
        </Field>
    )
}
