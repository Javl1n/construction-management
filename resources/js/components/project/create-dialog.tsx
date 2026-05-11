import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "@inertiajs/react";
import projects from "@/routes/projects";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { IconPicker } from "../ui/icon-picker";

export type CreateProjectType = {
    name: string;
    icon: IconName;
}

export default function CreateProjectDialog({ children }: { children: ReactNode }) {
    const { data, setData, errors, post, processing } = useForm<CreateProjectType>({
        name: '',
        icon: 'house',
    });

    const save = () => {
        post(projects.store().url, {
            preserveState: false,
            preserveScroll: false,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a New Project
                    </DialogTitle>
                    <DialogDescription>
                        Enter the name of the project you want to make, then click save.
                    </DialogDescription>
                </DialogHeader>
                <Field className="gap-2">
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
                <DialogFooter>
                    <Button onClick={save}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
