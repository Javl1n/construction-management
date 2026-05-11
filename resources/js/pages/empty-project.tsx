import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Project } from '@/types';
import EmptyProject from '@/components/project/empty';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from "@inertiajs/react";
import { CreateProjectType } from '@/components/project/create-dialog';
import projects from '@/routes/projects';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';

export default function EmptyDashboard() {
    const { data, setData, errors, post, processing } = useForm<CreateProjectType>({
        name: '',
    });

    const save = () => {
        post(projects.store().url, {

        });
    }
    return (
        <div className='grid gap-6'>
            <Field className='gap-2'>
                <FieldLabel htmlFor="name">
                    Project Name
                </FieldLabel>
                <Input id="name" name="name" placeholder="Camella Construction Project 1" value={data.name} onChange={e => setData('name', e.target.value)} />
                <FieldError>
                    {errors.name}
                </FieldError>
            </Field>

            <Field className='gap-2'>
                <FieldLabel htmlFor="name">
                    Project Name
                </FieldLabel>
                <Input id="name" name="name" placeholder="Camella Construction Project 1" value={data.name} onChange={e => setData('name', e.target.value)} />
                <FieldError>
                    {errors.name}
                </FieldError>
            </Field>
            <Button onClick={save}>
                Save
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                <TextLink href={logout()} tabIndex={5}>
                    Logout instead
                </TextLink>
            </div>
        </div>
    );
}

EmptyDashboard.layout = {
    title: 'Welcome!',
    description:
        'Let\'s get started with your first project!',
};
