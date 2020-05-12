import range from "lodash-es/range"
import { difference } from "rambda"

export const allPositions = ({ width, height }) =>
  range(height).flatMap((row) => range(width).map((column) => [row, column]))

export const ocuppiedPositions = ({ servers, clients }) =>
  [servers, clients].flatMap((coll) => coll.map((i) => [i.row, i.column]))

export const freePositions = (props) =>
  difference(allPositions(props), ocuppiedPositions(props))

export const choosePositions = () => {}

export function allocateClients() {}
