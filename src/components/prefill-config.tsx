import {
  ChevronDown,
  ChevronsLeftRight,
  ChevronsRightLeft,
  Search,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { FlowNodeData, GraphFormData, NodeFormField } from "~/lib/types";
import { UpdatePrefillFunc, useGraph, useGraphStore } from "~/store";
import { ScrollArea } from "./ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";

export function PrefillConfig({
  children,
  data,
  field,
}: {
  children: React.ReactNode;
  data: FlowNodeData;
  field: string;
}) {
  const [open, setOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  const graph = useGraph() as GraphFormData;
  const graphNode = graph.find((gn) => gn.nodeId === data.id);
  const graphField = graphNode?.fields?.find((f) => f.fieldId === field);

  const handleUpdatePrefill = useGraphStore(
    (state) => state.actions.updatePrefill,
  ) as UpdatePrefillFunc;

  const updateGraphDate = useGraphStore(
    (state) => state.actions.updateGraphDate,
  ) as () => void;

  const sorted = graphField?.compatibleFields.sort(
    (a, b) =>
      b.depth - a.depth ||
      a.nodeTitle.localeCompare(b.nodeTitle) ||
      a.fieldId.localeCompare(b.fieldId),
  );
  const searchFields = useMemo(
    () =>
      sorted?.filter((field) => {
        if (searchText.length < 2) {
          return true;
        }
        return field.fieldId.includes(searchText);
      }),
    [sorted, searchText],
  );
  const grouping: Record<string, boolean> = {};

  useEffect(() => {
    if (searchText.length > 1) {
      searchFields?.forEach((field) => {
        setOpenItems((prevOpenItems) => {
          if (!prevOpenItems.includes(field.nodeId)) {
            return [...prevOpenItems, field.nodeId];
          }
          return prevOpenItems;
        });
      });
    }
  }, [searchText, searchFields]);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button>{children}</button>
      </PopoverTrigger>
      <PopoverContent className="PopoverContent">
        <div className="absolute right-3 top-3 flex">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-transparent"
            onClick={() => setOpenItems(sorted?.map((f) => f.nodeId) ?? [])} // Close Popover
          >
            <ChevronsLeftRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-transparent"
            onClick={() => setOpenItems([])} // Close Popover
          >
            <ChevronsRightLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-transparent"
            onClick={() => setOpen(false)} // Close Popover
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold">Select from data to map</p>

          <div className="flex items-center justify-start gap-2 rounded-md border border-neutral-300 px-2 drop-shadow-md">
            <Label htmlFor="search">
              <Search className="h-4 w-4" />
            </Label>
            <Input
              type="search"
              placeholder="Search"
              id="search"
              className="rounded-none border-0 p-0 focus-visible:ring-0"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <ScrollArea className="h-40">
            <Accordion
              type="multiple"
              className="w-full"
              value={openItems}
              onValueChange={setOpenItems}
            >
              {searchFields?.length === 0 ? (
                <p className="text-sm">No results found.</p>
              ) : null}
              {searchFields?.map((field) => {
                if (grouping[field.nodeId]) {
                  return null;
                }
                grouping[field.nodeId] = true;
                return (
                  <AccordionItem
                    value={field.nodeId}
                    key={field.nodeId}
                    className="border-0"
                  >
                    <AccordionTrigger className="flex-row-reverse justify-end gap-2 py-1 text-sm font-bold hover:no-underline">
                      {field.nodeTitle}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pl-6 pr-6">
                      <ul>
                        {searchFields
                          .filter(
                            (innerField) => innerField.nodeId === field.nodeId,
                          )
                          .map((innerField) => (
                            <li key={`${field.nodeId}-${innerField.fieldId}`}>
                              <button
                                className="w-full rounded-md px-2 py-0.5 text-left hover:bg-indigo-100"
                                onClick={() => {
                                  handleUpdatePrefill(
                                    data.id,
                                    graphField as NodeFormField,
                                    {
                                      inheritFieldId: innerField.fieldId,
                                      inheritNodeId: innerField.nodeId,
                                      inheritNodeTitle: innerField.nodeTitle,
                                      active: true,
                                    },
                                  );
                                  updateGraphDate();
                                }}
                              >
                                {innerField.fieldId}
                              </button>
                            </li>
                          ))}
                      </ul>

                      <PopoverClose asChild>Bye</PopoverClose>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
