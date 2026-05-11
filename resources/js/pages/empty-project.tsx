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
import { IconName, IconPicker } from "@/components/ui/icon-picker";
import { useState } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';

export default function EmptyDashboard() {
    const { data, setData, errors, post, processing } = useForm<CreateProjectType>({
        name: '',
        icon: 'house',
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
