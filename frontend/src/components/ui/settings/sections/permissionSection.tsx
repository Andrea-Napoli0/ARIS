import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PermissionSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="fs-access" className="text-sm font-medium">Filesystem Access</Label>
        <Switch id="fs-access" className="data-[state=checked]:bg-green-600!" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="network-access" className="text-sm font-medium">Network Access</Label>
        <Switch id="network-access" className="data-[state=checked]:bg-green-600!" />
      </div>
    </div>
  );
}
