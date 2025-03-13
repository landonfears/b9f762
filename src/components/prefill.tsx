import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { GraphNodeData, NodeFormField } from "~/lib/types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { PrefillButton } from "./prefill-button";

export function Prefill({ data }: { data: GraphNodeData }) {
  const [prefill, setPrefill] = useState(true);

  const handleRemovePrefill = (field: NodeFormField) => {
    data.setGraphData((currGraphData) => {
      const currGraphNode = currGraphData.find(
        (currNode) => currNode.nodeId === data.graphNodeForm.nodeId,
      );
      let graphField = currGraphNode?.fields.find(
        (currField) => currField.fieldId === field.fieldId,
      );
      if (graphField) {
        graphField.prefill = null;
      }
      return currGraphData;
    });
  };
  const handleTogglePrefillActive = (field: NodeFormField, active: boolean) => {
    data.setGraphData((currGraphData) => {
      const currGraphNode = currGraphData.find(
        (currNode) => currNode.nodeId === data.graphNodeForm.nodeId,
      );
      let graphField = currGraphNode?.fields.find(
        (currField) => currField.fieldId === field.fieldId,
      );
      if (graphField && graphField.prefill) {
        graphField.prefill.active = active;
      }
      console.log("currGraphData toggle", currGraphData);
      return currGraphData;
    });
  };

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
            checked={prefill}
            onCheckedChange={setPrefill}
          />
        </div>
        <div className="flex flex-col gap-4">
          {data.graphNodeForm.fields.map((field) => {
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
              (field.compatibleFields.length === 0 || !prefill)
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
                  onRemove={() => handleRemovePrefill(field)}
                  onToggleActive={() => handleTogglePrefillActive(field, false)}
                />
              );
            } else if (field.prefill && !field.prefill?.active) {
              return (
                <PrefillButton
                  key={field.fieldId}
                  {...props}
                  variant="inactive"
                  label={`${field.fieldId}: ${field.prefill.inheritNodeTitle}.${field.prefill.inheritFieldId}`}
                  onRemove={() => handleRemovePrefill(field)}
                  onToggleActive={() => handleTogglePrefillActive(field, true)}
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
