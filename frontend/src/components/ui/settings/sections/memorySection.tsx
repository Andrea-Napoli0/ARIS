import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function MemorySection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="code-interpreter" className="text-sm font-medium">Code Interpreter</Label>
        <Switch id="code-interpreter" className="data-[state=checked]:bg-green-600!" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="web-search" className="text-sm font-medium">Web Search</Label>
        <Switch id="web-search" className="data-[state=checked]:bg-green-600!" />
      </div>
    </div>
  );
}
