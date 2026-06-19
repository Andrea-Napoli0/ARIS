import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaDevices } from "@/hooks/useMediaDevices"; // hook che abbiamo scritto prima
import { useState } from "react";

export function VoiceSection() {
  const { devices } = useMediaDevices();
  const [selectedMicId, setSelectedMicId] = useState<string>("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("");

  return (
    <div className="space-y-4">

      {/* Enable Voice */}
      <div className="flex justify-between text-white">
        <span>Enable Voice</span>
        <Switch className="data-[state=checked]:bg-green-600!" />
      </div>

      {/* Push To Talk */}
      <div className="flex justify-between text-white">
        <span>Push To Talk</span>
        <Switch className="data-[state=checked]:bg-green-600!" />
      </div>

      {/* Select Microfono */}
      <div className="flex justify-between items-center text-white">
        <span>Select Mic</span>
        <Select value={selectedMicId} onValueChange={setSelectedMicId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleziona microfono" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="bg-black">
              <SelectLabel>Input</SelectLabel>
              {devices.audioInputs.map((device, index) => (
                <SelectItem className="text-white" key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microfono ${index + 1}`}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Select Speaker */}
      <div className="flex justify-between items-center text-white">
        <span>Select Speaker</span>
        <Select value={selectedSpeakerId} onValueChange={setSelectedSpeakerId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleziona altoparlante" />
          </SelectTrigger>
          <SelectContent className="bg-black">
            <SelectGroup>
              <SelectLabel>Output</SelectLabel>
              {devices.audioOutputs.map((device, index) => (
                <SelectItem className="text-white" key={device.deviceId} value={device.deviceId}>
                  {device.label || `Altoparlante ${index + 1}`}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}