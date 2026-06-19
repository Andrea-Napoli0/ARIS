import { useEffect, useState, useCallback } from "react";

interface DeviceLists {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
}

export function useMediaDevices() {
  const [devices, setDevices] = useState<DeviceLists>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  const [permissionGranted, setPermissionGranted] = useState(false);

  const refresh = useCallback(async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices({
      audioInputs: all.filter(d => d.kind === "audioinput"),
      audioOutputs: all.filter(d => d.kind === "audiooutput"),
      videoInputs: all.filter(d => d.kind === "videoinput"),
    });
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop()); // chiudo subito, non mi serve lo stream ora
      setPermissionGranted(true);
      await refresh(); // ora i label saranno popolati
    } catch (err) {
      console.error("Permesso negato:", err);
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
    navigator.mediaDevices.addEventListener("devicechange", refresh);
    return () => navigator.mediaDevices.removeEventListener("devicechange", refresh);
  }, [refresh]);

  return { devices, permissionGranted, requestPermission, refresh };
}