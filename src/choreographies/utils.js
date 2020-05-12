import unzip from "lodash-es/unzip"
import { zip } from "rambda"

export const createRegularClients = (clients) =>
  clients.map(([row, column]) => ({
    row,
    column,
    action: "read",
    state: "ready",
  }))

export const createWriters = (writers) => {
  const [coords, data] = unzip(writers)

  return zip(createRegularClients(coords), data).map(([client, data]) => ({
    ...client,
    action: "write",
    data,
  }))
}

export const wireClients = (clients, wires) =>
  zip(clients, wires).flatMap(([start, targets]) =>
    targets.map((end) => ({ start, end, state: "none" }))
  )
