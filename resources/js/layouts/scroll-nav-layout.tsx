import CardSection from "@/components/card-section";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Plus, Scan } from "lucide-react";
import { createContext, PropsWithChildren, RefObject, useContext, useRef, useState } from "react";

interface ScrollNavContextType {
    scrollContainerRef: RefObject<HTMLDivElement | null>,
    active: string
    setActive: (id: string) => void
    sectionRefs: RefObject<Record<string, HTMLDivElement | null>>,
    scrollTo: (id: string, behavior?: ScrollBehavior) => void,
    registerRef: (id: string, el: HTMLDivElement | null) => void
}

const ScrollNavContext = createContext<ScrollNavContextType | null>(null);

export function useScrollNav() {
    const ctx = useContext(ScrollNavContext)

    if (!ctx) throw new Error('useScrollNav must be used within <ScrollNavLayout>')

    return ctx
}

export function ScrollNavLayout({ children, heading: { title, description } }: PropsWithChildren<{
    heading: {
        title: string,
        description: string
    }
}>) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState('labor');

    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const scrollTo = (id: string, behavior: ScrollBehavior = "smooth") => {
        setActive(id);
        sectionRefs.current[id]?.scrollIntoView({ behavior: behavior });
    }

    const registerRef = (id: string, el: HTMLDivElement | null) => {
        if (el) sectionRefs.current[id] = el;
        else delete sectionRefs.current[id];
    }
    return (
        <ScrollNavContext.Provider value={{
            scrollContainerRef,
            active,
            setActive,
            sectionRefs,
            scrollTo,
            registerRef
        }}>
            <div className="px-4 pt-6">
                <Heading
                    title={title}
                    description={description}
                />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    {children}
                </div>
            </div>
        </ScrollNavContext.Provider>
    )
}

export function ScrollNavAside({ children }: PropsWithChildren) {
    const { open } = useSidebar();
    return (
        <>
            <ScrollArea className={cn([
                {
                    "md:max-h-[calc(100vh-9.6rem)]": !open,
                    "md:max-h-[calc(100vh-10.6rem)]": open,
                }
            ])}>
                <aside className="w-full max-w-xl lg:w-48 me-4 pb-20">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                    >
                        {children}
                    </nav>
                </aside>
            </ScrollArea>
            <Separator className="my-6 lg:hidden" />
        </>
    )
}

export function ScrollNavAsideHeader({ children }: PropsWithChildren) {
    return (
        <div className="text-muted-foreground text-xs">
            {children}
        </div>
    )
}

export function ScrollNavAsideButton({ children, id, isActive, variant = "ghost" }: PropsWithChildren<{
    id?: string,
    isActive?: boolean,
    variant?: "default" | "destructive" | "ghost" | "secondary" | "outline" | "link"
}>) {
    const { scrollTo, active } = useScrollNav();

    return (
        <Button
            size="sm"
            variant={variant}
            onClick={() => id && scrollTo(id)}
            asChild
            className={cn('w-full justify-start', {
                'bg-muted': id === active || isActive
            })}
        >
            <div>
                {children}
            </div>
        </Button>
    )
}

export function ScrollNavContent({ children }: PropsWithChildren) {
    const { open } = useSidebar();
    const { scrollContainerRef } = useScrollNav();

    return (
        <ScrollArea
            ref={scrollContainerRef}
            className={cn([
                "flex-1", {
                    "md:max-h-[calc(100vh-9.6rem)]": !open,
                    "md:max-h-[calc(100vh-10.6rem)]": open,
                }])}>
            <section className="space-y-6 xl:w-5xl md:w-2xl pb-20 pt-1">
                {children}
            </section>
        </ScrollArea>
    )
}

export function ScrollNavItem({ children, id }: PropsWithChildren<{
    id: string
}>) {
    const { scrollContainerRef, active, setActive, registerRef } = useScrollNav();
    return (
        <CardSection
            id={id}
            onInView={setActive}
            registerRef={registerRef}
            scrollContainer={scrollContainerRef.current}
        >
            {children}
        </CardSection>
    )
}
