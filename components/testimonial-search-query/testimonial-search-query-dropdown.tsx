import { ChevronDown, ChevronUp, PlusIcon, XIcon } from "lucide-react";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  name: string;
  displayValue?: string;
  isEnabled: boolean;
  clear: () => void;
  children: (args: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
};

export default function TestimonialSearchDropdown({
  name,
  displayValue,
  isEnabled,
  clear,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup>
      {isEnabled ? (
        <Button size="sm" variant="outline" onClick={clear}>
          <XIcon /> {name}
        </Button>
      ) : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {isEnabled ? (
            <Button
              size="sm"
              variant="outline"
              className="text-accent-foreground"
            >
              {displayValue}
              {open ? <ChevronUp /> : <ChevronDown />}
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="border-dashed">
              <PlusIcon /> {name}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {children({ open, setOpen })}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
