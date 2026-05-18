import { Auth, User } from "@/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usePage } from "@inertiajs/react";

export default function SelectEngineer({ value, onChange }: { value: User['id'], onChange: (value: User['id']) => void }) {
    const { engineers, auth: { user } } = usePage<{ engineers: User[], auth: Auth }>().props;
    return (
        <Select
            value={value.toString()}
            onValueChange={(value) => onChange(parseInt(value))}
            disabled={user.role == 'engineer'}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select Engineer" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>
                        Engineers
                    </SelectLabel>
                    {engineers.map((engineer) => (
                        <SelectItem key={engineer.id} value={engineer.id.toString()}>
                            {engineer.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
