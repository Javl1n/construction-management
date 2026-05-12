import { PropsWithChildren, ReactNode } from "react";
import { useInView } from 'react-intersection-observer';

interface SectionProps {
    id: string,
    onInView: (id: string) => void;
    registerRef: (id: string, el: HTMLDivElement | null) => void;
    scrollContainer: HTMLDivElement | null;
    children: ReactNode
}

export default function CardSection({ id, onInView, children, registerRef, scrollContainer }: SectionProps) {
    const { ref } = useInView({
        root: scrollContainer,
        rootMargin: '0px 0px -80% 0px',
        onChange: (inView) => {
            if (inView) onInView(id);
        }
    })

    return (
        <div
            id={id}
            ref={(el) => {
                ref(el);
                registerRef(id, el);
            }}
        >
            {children}
        </div>
    )
}
