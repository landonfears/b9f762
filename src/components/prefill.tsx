import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { GraphNodeData } from "~/lib/types";

export function Prefill({ data }: { data: GraphNodeData }) {
  console.log("data", data);
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{data.label}</SheetTitle>
        <SheetDescription>Description</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">Contnt</div>
      <SheetFooter>
        <SheetClose asChild>
          {/* <Button type="submit">SUBMIT</Button> */}
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
