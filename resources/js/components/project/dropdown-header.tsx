import { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePage } from "@inertiajs/react";
import { Project } from "@/types";
import { Plus } from "lucide-react";

export default function DropdownHeader({ children }: { children: ReactNode }) {
    const { projects, project } = usePage<{ projects: Project[], project: Project }>().props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Projects
                </DropdownMenuLabel>
                {projects.length > 0 ?
                    projects.map(project =>
                        <DropdownMenuItem>

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
