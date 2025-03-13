import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { GraphNodeData } from "~/lib/types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { PrefillButton } from "./prefill-button";

export function Prefill({ data }: { data: GraphNodeData }) {
  const [prefill, setPrefill] = useState(true);
  console.log("data", data);
  return (
    <SheetContent side="right">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-left">{data.label}</SheetTitle>
        {/* <SheetDescription>Description</SheetDescription> */}
      </SheetHeader>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="prefill">Prefill fields for this form</Label>
          <Switch
            id="prefill"
            className="data-[state=checked]:bg-indigo-600"
            checked={prefill}
            onCheckedChange={setPrefill}
          />
        </div>
        <div className="flex flex-col gap-4">
          {data.graphNodeForm.fields.map((field) => {
            /*
           4 prefill states:
            1. Null prefill, but compatible fields
            2. Null prefill, no compatible fields
            3. Non-null prefill, active
            4. Non-null prefill, inactive
          */
            if (
              field.prefill === null &&
              field.compatibleFields.length > 0 &&
              prefill
            ) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  data={data}
                  variant="ready"
                  label={field.fieldId}
                  type={field.type}
                />
              );
            } else if (
              field.prefill === null &&
              (field.compatibleFields.length === 0 || !prefill)
            ) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  data={data}
                  variant="disabled"
                  label={field.fieldId}
                  type={field.type}
                />
              );
            } else if (field.prefill?.active) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  data={data}
                  variant="active"
                  label={`${field.fieldId}: ${field.prefill.inheritNodeTitle}.${field.prefill.inheritFieldId}`}
                  type={field.type}
                />
              );
            } else if (field.prefill && !field.prefill?.active) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  data={data}
                  variant="inactive"
                  label={`${field.fieldId}: ${field.prefill.inheritNodeTitle}.${field.prefill.inheritFieldId}`}
                  type={field.type}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
      <SheetFooter>
        {/* <SheetClose asChild> */}
        {/* <Button type="submit">SUBMIT</Button> */}
        {/* </SheetClose> */}
      </SheetFooter>
    </SheetContent>
  );
}
