jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

import * as Location from "expo-location";
import {
  formatCoordinates,
  requestLocationPermission,
  captureLocation,
} from "../location";

describe("formatCoordinates", () => {
  it("formats positive lat/lng as N/E", () => {
    // -6.2088, 106.8456
    const result = formatCoordinates(-6.2088, 106.8456);
    expect(result).toMatch(/6°\d+'[\d.]+"S 106°\d+'[\d.]+"E/);
  });

  it("formats negative lat as S", () => {
    const result = formatCoordinates(-33.8688, 151.2093);
    expect(result).toContain("S");
    expect(result).not.toContain("N");
  });

  it("formats negative lng as W", () => {
    const result = formatCoordinates(40.7128, -74.006);
    expect(result).toContain("W");
    expect(result).not.toContain("E");
  });

  it("handles equator and prime meridian", () => {
    const result = formatCoordinates(0, 0);
    expect(result).toMatch(/0°0'0\.[01]"?N 0°0'0\.[01]"?E/);
  });

  it("includes degree symbol, minutes, seconds, and direction", () => {
    const result = formatCoordinates(51.5074, -0.1278);
    expect(result).toMatch(/\d+°/);
    expect(result).toMatch(/\d+'/);
    expect(result).toMatch(/[\d.]+"/);
    expect(result).toMatch(/[NSEW]/);
  });
});

describe("requestLocationPermission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when already granted", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    const result = await requestLocationPermission();
    expect(result).toBe(true);
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it("requests permission when not determined", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "undetermined" });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });

    const result = await requestLocationPermission();
    expect(result).toBe(true);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it("returns false when permission denied", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "undetermined" });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

    const result = await requestLocationPermission();
    expect(result).toBe(false);
  });
});

describe("captureLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns location when permission granted", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -37.812, longitude: 144.963 },
    });

    const result = await captureLocation();
    expect(result).not.toBeNull();
    expect(result!.latitude).toBe(-37.812);
    expect(result!.longitude).toBe(144.963);
    expect(result!.formatted).toContain("S");
    expect(result!.formatted).toContain("E");
  });

  it("returns null when permission denied", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

    const result = await captureLocation();
    expect(result).toBeNull();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it("returns null on error", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockRejectedValue(new Error("Location unavailable"));

    const result = await captureLocation();
    expect(result).toBeNull();
  });
});
