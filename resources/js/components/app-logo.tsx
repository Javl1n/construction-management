import AppLogoIcon from '@/components/app-logo-icon';
import { Project } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export default function AppLogo() {
    const { project, auth: { user: { role, ...user } } } = usePage<{ project: Project }>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {role == 'admin' && 'Admin Dashboard'}
                    {role == 'engineer' && (project ? project.name : <span className='text-muted-foreground'>No Projects Yet</span>)}
                </span>
            </div>
            <ChevronsUpDown className='ml-auto' />
        </>
    );
}
