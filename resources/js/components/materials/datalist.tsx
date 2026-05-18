import { Material } from "@/types"
import { usePage } from "@inertiajs/react";

export function MaterialDatalist() {
    const { materials } = usePage<{ materials: Material[] }>().props;
    return (
        <datalist id="materials">
            {materials?.map((material, index) => (
                <option value={material.name} key={index} />
            ))}
        </datalist>
    )
}
