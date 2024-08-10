import { permissions } from "@/interfaces";

export const removeKeyFromArray = (arr: any, key: keyof permissions) => {
  return arr.map((item: permissions) => {
    const { [key]: _, ...rest } = item; // Destructure to remove the key
    return rest;
  });
};
