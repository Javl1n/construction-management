import { usePage } from "@inertiajs/react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { Auth, User } from "@/types";
import { useState } from "react";

export default function EngineerCombobox({ value, onChange }: { value: User['id'], onChange: (id: User['id']) => null }) {
    const { engineers, auth: { user } } = usePage<{ engineers: User[], auth: Auth }>().props;
    const [selected, setSelected] = useState(engineers.filter(engineer => engineer.id === value)[0]);

    return (
        <Combobox
            items={engineers}
            value={selected}
            onValueChange={(engineer) => {
                setSelected(engineer!)
                onChange(engineer!.id)
            }}
            itemToStringValue={(engineer: User) => engineer.id.toString()}
            disabled={user.role === 'engineer'}
        >
            <ComboboxInput placeholder="Select an engineer" />
            <ComboboxContent>
                <ComboboxEmpty>
                    No engineers found.
                </ComboboxEmpty>
                <ComboboxList>
                    {(engineer: User) => (
                        <ComboboxItem key={engineer.id} value={engineer.id}>
                            {engineer.name}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
