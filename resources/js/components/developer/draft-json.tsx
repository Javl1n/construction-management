import { ScrollNavAsideButton, ScrollNavAsideHeader } from "@/layouts/scroll-nav-layout";
import drafts from "@/routes/drafts";
import { FileClock, FileInput, FileUp, Import, SquareArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function DeveloperDraftJSON() {
    const handleImport = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            const promise = fetch(drafts.import.url(), {
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: formData
            }).then(async (response) => {
                if (!response.ok) {
                    const body = await response.json().catch(() => null);
                    throw new Error(body?.message ?? 'Failed to import draft');
                }
            });

            toast.promise(promise, {
                loading: 'Importing draft...',
                success: () => {
                    window.location.reload();
                    return 'Draft imported';
                },
                error: (error) => error instanceof Error ? error.message : 'Failed to import draft',
            });
        };

        input.click();
    }

    return (
        <>
            <ScrollNavAsideHeader>
                Developer
            </ScrollNavAsideHeader>
            <a href={drafts.export().url} download>
                <ScrollNavAsideButton>
                    <FileUp />
                    Export JSON
                </ScrollNavAsideButton>
            </a>
            <button onClick={handleImport}>
                <ScrollNavAsideButton>
                    <FileInput />
                    Import JSON
                </ScrollNavAsideButton>
            </button>
        </>
    )
}
