import AppLogoIcon from '@/components/app-logo-icon';
import { Auth, Project } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';

export default function AppLogo() {
    const { project, auth: { user: { role, ...user } } } = usePage<{ project: Project, auth: Auth }>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <DynamicIcon name={project ? project.icon : 'hard-hat'} className="size-5 text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {(project ? project.name : <span className='text-muted-foreground'>No Projects Yet</span>)}
                </span>
            </div>
            <ChevronsUpDown className='ml-auto' />
        </>
    );
}
