import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { GraphFormData, FlowNodeData, NodeFormField } from "~/lib/types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { PrefillButton } from "./prefill-button";
import { useGraph, useGraphStore } from "~/store";
import type {
  RemovePrefillFunc,
  TogglePrefillAllFunc,
  TogglePrefillFunc,
} from "~/store";

export function Prefill({ data }: { data: FlowNodeData }) {
  const graph = useGraph() as GraphFormData;
  const graphNode = graph.find((gn) => gn.nodeId === data.id);
  const handleRemovePrefill = useGraphStore(
    (state) => state.actions.removePrefill,
  ) as RemovePrefillFunc;
  const handleTogglePrefillActive = useGraphStore(
    (state) => state.actions.togglePrefillActive,
  ) as TogglePrefillFunc;

  const handleTogglePrefillAll = useGraphStore(
    (state) => state.actions.togglePrefillAll,
  ) as TogglePrefillAllFunc;
  console.log("graph", graphNode);

  const isPrefill = useCallback(() => {
    const hasPrefill = !!graphNode?.fields.filter((f) => f.prefill)?.length;
    const hasActivePrefill = !!graphNode?.fields.filter(
      (f) => f.prefill?.active,
    )?.length;

    return (hasPrefill && hasActivePrefill) || !hasPrefill;
  }, [graphNode]);

  return (
    <SheetContent side="right">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-left text-2xl font-black">
          {data.label}
        </SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="prefill">Prefill fields for this form</Label>
          <Switch
            id="prefill"
            className="data-[state=checked]:bg-indigo-600"
            checked={isPrefill()}
            onCheckedChange={(e) => handleTogglePrefillAll(data.id, e)}
          />
        </div>
        <div className="flex flex-col gap-4">
          {graphNode?.fields.map((field) => {
            const props = {
              data: data,
              label: field.fieldId,
              type: field.type,
            };
            /*
           4 prefill states:
            1. Null prefill, but compatible fields
            2. Null prefill, no compatible fields
            3. Non-null prefill, active
            4. Non-null prefill, inactive
          */
            if (field.prefill === null && field.compatibleFields.length > 0) {
              return (
                <PrefillButton key={field.fieldId} {...props} variant="ready" />
              );
            } else if (
              field.prefill === null &&
              field.compatibleFields.length === 0
            ) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  {...props}
                  variant="disabled"
                />
              );
            } else if (field.prefill?.active) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  {...props}
                  variant="active"
                  label={`${field.fieldId}: ${field.prefill.inheritNodeTitle}.${field.prefill.inheritFieldId}`}
                  onRemove={() => handleRemovePrefill(data.id, field)}
                  onToggleActive={() =>
                    handleTogglePrefillActive(data.id, field, false)
                  }
                />
              );
            } else if (field.prefill && !field.prefill?.active) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  {...props}
                  variant="inactive"
                  label={`${field.fieldId}: ${field.prefill.inheritNodeTitle}.${field.prefill.inheritFieldId}`}
                  onRemove={() => handleRemovePrefill(data.id, field)}
                  onToggleActive={() =>
                    handleTogglePrefillActive(data.id, field, true)
                  }
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
