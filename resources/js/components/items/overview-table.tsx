import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { CreateWorkItem } from "./create";

export default function ItemOverviewTable({ item: { materials, laborers, equipment } }: { item: CreateWorkItem }) {
    const materialCost = (
        materials.map(
            (material) => material.quantity * material.price
        ).reduce((acc, val) => acc + val, 0)
    )

    const laborCost = (
        laborers.map(
            (laborer) => laborer.quantity * laborer.rate
        ).reduce((acc, val) => acc + val, 0)
    )

    const equipmentCost = (
        equipment.map(
            (equipment) => equipment.quantity * equipment.rate
        ).reduce((acc, val) => acc + val, 0)
    )

    const total = materialCost + laborCost + equipmentCost;

    const rows: {
        name: string,
        cost: number
    }[] = [
            {
                name: "Materials",
                cost: materialCost,
            },
            {
                name: "Labor",
                cost: laborCost
            },
            {
                name: "Equipment",
                cost: equipmentCost
            }
        ]
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Category
                    </TableHead>
                    <TableHead className="text-right">
                        Cost
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell className="w-full font-bold">
                            {row.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            <div className="flex justify-between">
                                <span>
                                    &#8369;
                                </span>
                                <span className="font-mono">
                                    {row.cost.toLocaleString('en-US', {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="w-full">
                        Total
                    </TableCell>
                    <TableCell className="font-bold">
                        <div className="flex gap-2 justify-between">
                            <span>
                                &#8369;
                            </span>
                            <span className="font-mono">
                                {total.toLocaleString('en-US', {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })}
                            </span>
                        </div>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
