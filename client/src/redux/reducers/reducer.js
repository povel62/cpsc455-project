import * as types from "../actions/actionTypes";

export default function reducer(
  state = {
    number: 0,
  },
  action
) {
  switch (action.type) {
    case types.SAVE_NUMBER:
      return Object.assign({}, state, { number: action.number });
    default:
      return state;
  }
}
