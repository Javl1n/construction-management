import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useForm } from "@inertiajs/react";
import workers from "@/routes/workers";

export default function CreateWorkerDialog({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, errors } = useForm<{
        name: string
    }>({
        name: ''
    });

    const save = () => {
        post(workers.store().url, {
            onSuccess: () => setIsOpen(false)
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        A New Worker
                    </DialogTitle>
                    <DialogDescription>
                        Let's add another worker to your company.
                    </DialogDescription>
                </DialogHeader>
                <Field className="gap-2">
                    <FieldLabel>Name</FieldLabel>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} name="name" placeholder="Billy Doe" />
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
