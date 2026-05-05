import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "@inertiajs/react";
import projects from "@/routes/projects";

export type CreateProjectType = {
    name: string;
}

export default function CreateProjectDialog({ children }: { children: ReactNode }) {
    const { data, setData, errors, post, processing } = useForm<CreateProjectType>({
        name: '',
    });

    const save = () => {
        post(projects.store().url, {

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
                    <Input id="name" name="name" placeholder="Camella Construction" value={data.name} onChange={e => setData('name', e.target.value)} />
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
