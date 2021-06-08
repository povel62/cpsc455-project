import * as types from "./actionTypes";

export function saveNumber(number) {
  return { type: types.SAVE_NUMBER, number };
}
