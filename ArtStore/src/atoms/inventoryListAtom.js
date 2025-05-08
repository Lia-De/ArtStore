import { atomWithStorage } from "jotai/utils";

export const inventoryListAtom = atomWithStorage("inventory", []);
export const makerListAtom = atomWithStorage("makerList", []);
export const singleInventoryAtom = atomWithStorage("singleInventory", {});