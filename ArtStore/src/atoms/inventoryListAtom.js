import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const inventoryListAtom = atom("inventory", []);
export const makerListAtom = atomWithStorage("makerList", []);
export const singleInventoryAtom = atom("singleInventory", {});