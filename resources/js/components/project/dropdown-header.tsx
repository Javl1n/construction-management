import { ReactNode, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link, router, usePage } from "@inertiajs/react";
import { Auth, Project } from "@/types";
import { Plus } from "lucide-react";
import projectRoutes from "@/routes/projects";

export default function DropdownHeader({ children }: { children: ReactNode }) {
    const { projects, project, auth } = usePage<{ projects: Project[], project: Project, auth: Auth }>().props;
    const [isOpen, setIsOpen] = useState(false);

    const switchProject = (id: number) => {
        router.post(projectRoutes.switch().url, {
            project_id: id
        });
    }

    return (
        <DropdownMenu onOpenChange={setIsOpen} open={auth.user.role == 'engineer' && isOpen}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Projects
                </DropdownMenuLabel>
                {projects.length > 0 ?
                    projects.map(project =>
                        <DropdownMenuItem onClick={() => switchProject(project.id)} key={project.id}>
                            {project.name}
                        </DropdownMenuItem>
                    )

                    :
                    <DropdownMenuItem disabled className="justify-center text-sm">
                        No Projects Yet
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem className="">
                    <Plus />
                    Create Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
