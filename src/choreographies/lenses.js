import { set, compose, lensProp, over, lensIndex } from "rambda"

export const setterFor = (lens) => (state) => set(lens, state)
export const setterForProp = (prop) => setterFor(lensProp(prop))

export const setItemState = setterForProp("state")
export const setItemAction = setterForProp("action")
export const setItemData = setterForProp("data")
export const setTransaction = setterForProp("transaction")

export const modifyIndex = (index, op) => over(lensIndex(index), op)
export const modifyIndices = (indices, op) =>
  compose(...indices.map((i) => modifyIndex(i, op)))
