import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useSortable } from '@dnd-kit/react/sortable';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

interface SortableProp<T extends { id: number }> {
    items: T[];
    onMove: (items: T[]) => void;
    children: ReactNode
}

export function useSortableList<T extends { id: number }>(initial: T[]) {
    const [items, setItems] = useState(initial);

    useEffect(() => {
        setItems(prev => {
            const initialMap = new Map(initial.map(i => [i.id, i]))

            const kept = prev
                .filter(p => initialMap.has(p.id))
                .map(p => initialMap.get(p.id)!);

            const prevIds = new Set(prev.map(p => p.id));
            const newItems = initial.filter(i => !prevIds.has(i.id));

            return [...kept, ...newItems];
        });
    }, [initial]);

    return [items, setItems] as const;
}

export function SortableList<T extends { id: number }>({ items, onMove, children }: SortableProp<T>) {
    return (
        <DragDropProvider
            onDragEnd={(event) => onMove(move(items, event) as T[])}
        >
            {children}
        </DragDropProvider >
    );
}

export function SortableListItem({ id, index, children }: PropsWithChildren<{ id: number, index: number }>) {
    const { ref } = useSortable({ id, index });

    return (
        <div ref={ref} className='cursor-grab'>
            {children}
        </div>
    )
}
