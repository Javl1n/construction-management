import { usePage } from '@inertiajs/react';
import { Auth } from '@/types';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from "@inertiajs/react";
import { CreateProjectType } from '@/components/project/create-dialog';
import projects from '@/routes/projects';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';
import { IconPicker } from "@/components/ui/icon-picker";
import { DynamicIcon } from 'lucide-react/dynamic';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import IconNameField from '@/components/project/icon-name-input';
import SelectEngineer from '@/components/project/select-engineer';

export default function EmptyDashboard() {
    const { auth: { user } } = usePage<{ auth: Auth }>().props;
    const form = useForm<CreateProjectType>({
        name: '',
        icon: 'house',
    });

    const { data, setData, errors, post, processing } = form;

    const save = () => {
        post(projects.store().url, {

        });
    }
    return (
        <div className='grid gap-6'>
            <IconNameField form={form} />

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
