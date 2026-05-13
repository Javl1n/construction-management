import { usePage } from "@inertiajs/react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { Material } from "@/types";
import { ComponentProps } from "react";

type Props = ComboboxPrimitive.Root.Props<string>;
export default function MaterialCombobox({ ...props }: Props) {
    const { materials } = usePage<{ materials?: Material[] }>().props;
    const materialList = materials?.map((material) => material.name) ?? []


    return (
        <Combobox
            items={materialList}
            {...props}
        >
            <ComboboxInput placeholder="Select a material" />
            <ComboboxContent>
                <ComboboxEmpty>No materials found.</ComboboxEmpty>
                <ComboboxList>
                    {(material: string) => (
                        <ComboboxItem key={material} value={material}>
                            {material}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
