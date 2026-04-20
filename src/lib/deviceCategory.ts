import { isIPhoneModel, isIPadModel } from "@/lib/utils";

export type DeviceCategory = "iphone" | "ipad" | "samsung";

export const DEVICE_CATEGORY_LABELS: Record<DeviceCategory, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  samsung: "Samsung",
};

export const DEVICE_CATEGORY_ORDER: DeviceCategory[] = ["iphone", "ipad", "samsung"];

export function isValidDeviceCategory(v: unknown): v is DeviceCategory {
  return v === "iphone" || v === "ipad" || v === "samsung";
}

/**
 * Returns true if the given model (name + brand name) belongs to the
 * given device category. Apple is split by model-name prefix; Samsung
 * is matched by brand name.
 */
export function modelMatchesCategory(
  modelName: string,
  brandName: string,
  category: DeviceCategory
): boolean {
  if (category === "iphone") return isIPhoneModel(modelName);
  if (category === "ipad") return isIPadModel(modelName);
  if (category === "samsung") return brandName.toLowerCase() === "samsung";
  return false;
}
