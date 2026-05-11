import { usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, Project } from '@/types';
import DropdownHeader from './project/dropdown-header';
import projects from '@/routes/projects';

const mainNavItems: () => NavItem[] = () => {
    const { project } = usePage<{ project: Project }>().props;
    return [
        {
            title: 'Dashboard',
            href: projects.show(),
            icon: LayoutGrid,
        },
        // {
        //     title: 'Workers',
        //     href: workers.index(),
        //     icon: Hammer
        // }
    ]
};

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownHeader>
                            <SidebarMenuButton size="lg">
                                <AppLogo />
                            </SidebarMenuButton>
                        </DropdownHeader>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems()} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar >
    );
}
