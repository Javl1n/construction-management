import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "@inertiajs/react";
import projects from "@/routes/projects";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { IconPicker } from "../ui/icon-picker";
import IconNameField from "./icon-name-input";

export type CreateProjectType = {
    name: string;
    icon: IconName;
}

export default function CreateProjectDialog({ children }: { children: ReactNode }) {
    const form = useForm<CreateProjectType>({
        name: '',
        icon: 'house',
    });

    const { data, setData, errors, post, processing } = form

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
                <IconNameField form={form} />
                <DialogFooter>
                    <Button onClick={save}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
