import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { FolderClosed, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateProjectDialog from './create-dialog';

export default function EmptyProject() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <HardHat />
                </EmptyMedia >
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating your first project.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <CreateProjectDialog>
                    <Button>
                        Create Project
                    </Button>
                </CreateProjectDialog>
            </EmptyContent>
        </Empty>
    )
}
