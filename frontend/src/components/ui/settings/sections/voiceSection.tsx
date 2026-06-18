import { Switch } from "@/components/ui/switch";

export function VoiceSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-white">
        <span>Enable Voice</span>
        {/* Verde personalizzato */}
        <Switch className="data-[state=checked]:bg-green-600!" />
      </div>

      <div className="flex justify-between text-white">
        <span>Push To Talk</span>
        {/* Arancione personalizzato */}
        <Switch className="data-[state=checked]:bg-green-600!" />
      </div>
    </div>
  );
}