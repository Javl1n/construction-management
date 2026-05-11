import { ReactNode, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link, router, usePage } from "@inertiajs/react";
import { Auth, Project } from "@/types";
import { Plus } from "lucide-react";
import projectRoutes from "@/routes/projects";
import CreateProjectDialog from "./create-dialog";
import { DynamicIcon } from "lucide-react/dynamic";

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
            <DropdownMenuContent side="right">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Projects
                </DropdownMenuLabel>
                {projects.length > 0 ?
                    projects.map(project =>
                        <DropdownMenuItem onClick={() => switchProject(project.id)} key={project.id}>
                            <>
                                <div className="border p-1 rounded">
                                    <DynamicIcon name={project.icon} className="stroke-white" />
                                </div>
                                {project.name}
                            </>
                        </DropdownMenuItem>
                    )
                    :
                    <DropdownMenuItem disabled className="justify-center text-sm">
                        No Projects Yet
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator />
                <CreateProjectDialog>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                        <>
                            <div className="border p-1 rounded">
                                <Plus className="stroke-white" />
                            </div>
                            Create Project
                        </>
                    </DropdownMenuItem>
                </CreateProjectDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
