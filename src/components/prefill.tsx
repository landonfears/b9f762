import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { HandlePosition } from "~/server/avantos";

export function Prefill({
  data,
}: {
  data: {
    label: string;
    type: string;
    sourceHandles: HandlePosition[];
    targetHandles: HandlePosition[];
  };
}) {
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
