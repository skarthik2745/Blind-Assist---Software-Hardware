export interface BlynkPinData {
  V0: number; // SOS
  V1: number; // Voice Recording
  V2: number; // Object Detection
  V3: number; // Medicine Reminder
}

export const BLYNK_API_URL =
  'https://blynk.cloud/external/api/get?token=U0jtRl3irgawYNg3fUEUIfqcghiDLAXn&V0&V1&V2&V3';

export async function fetchBlynkPins(): Promise<BlynkPinData | null> {
  try {
    const response = await fetch(BLYNK_API_URL);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      V0: Number(data.V0 ?? 0),
      V1: Number(data.V1 ?? 0),
      V2: Number(data.V2 ?? 0),
      V3: Number(data.V3 ?? 0),
    };
  } catch (error) {
    return null;
  }
}
