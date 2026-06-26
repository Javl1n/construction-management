import { ScrollNavAsideButton, ScrollNavAsideHeader } from "@/layouts/scroll-nav-layout";
import drafts from "@/routes/drafts";
import { FileClock, FileInput, FileUp, Import, SquareArrowRight } from "lucide-react";

export default function DeveloperDraftJSON() {
    const handleImport = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            await fetch(drafts.import.url(), {
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: formData
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
