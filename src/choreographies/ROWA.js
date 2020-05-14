import {
  modifyIndex,
  modifyIndices,
  setItemData,
  setItemState,
  setTransaction,
} from "./lenses"

import { delaySequence, delayTraverse } from "./timing"
import { createRegularClients, createWriters, wireClients } from "./utils"

import range from "lodash-es/range"
import unzip from "lodash-es/unzip"
import { compose, map, append, prepend, concat, drop, take } from "rambda"
import { delay } from "blend-promise-utils"

export const ROWARequirements = {
  servers: 5,
  serversRow: 2,
  width: 5,
  height: 4,
}

export const ROWAChoreography = async (canvasProps) => {
  await delay(2000)
  const steps = [showRead, showReadDown, showWrite, showWriteFail]

  for (let step of steps) await step(canvasProps)
}

async function showRead({ setClients, setWires }) {
  const [clients, wires] = unzip([
    [[0, 0], [[2, 0]]],
    [[1, 3], [[2, 3]]],
    [[3, 3], [[2, 3]]],
  ])
  const items = createRegularClients(clients)

  await delaySequence([
    [600, () => delayTraverse(300, items, compose(setClients, append))],
    [800, () => setWires(wireClients(clients, wires))],
    [1000, () => setWires(map(setItemState("success")))],
    [1000, () => setWires([])],
    [1000, () => setClients([])],
  ])
}

async function showReadDown({ setServers, setClients, setWires }) {
  let [clients, wires] = unzip([
    [
      [1, 1],
      [
        [2, 1],
        [2, 2],
      ],
    ],
  ])
  let wireItems = wireClients(clients, wires)

  await delaySequence([
    [1000, () => setServers(modifyIndices([1, 4], setItemState("down")))],
    [600, () => setClients(createRegularClients(clients))],

    [600, () => setWires(append(wireItems[0]))],
    [400, () => setWires(modifyIndex(0, setItemState("failure")))],
    [600, () => setWires(append(wireItems[1]))],
    [400, () => setWires(modifyIndex(1, setItemState("success")))],
    [1000],

    [1000, () => setWires([])],
    [400, () => setClients([])],
    [600, () => setServers(map(setItemState("ready")))],
  ])
}

async function showWrite({ setServers, setClients, setWires }) {
  let writers = [[[1, 2], "b"]]
  let writerWires = wireClients(unzip(writers)[0], [
    range(5).map((i) => [2, i]),
  ])

  let [readers, readerWires] = unzip([
    [[3, 1], [[2, 1]]],
    [[3, 3], [[2, 3]]],
  ])

  await delaySequence([
    [600, () => setClients(createWriters(writers))],
    [800, () => setWires(writerWires)],
    [
      2000,
      () => {
        setWires(map(setItemState("success")))
        setServers(map(setTransaction("write")))
      },
    ],
    [600, () => setClients(concat(createRegularClients(readers)))],
    [800, () => setWires(concat(wireClients(readers, readerWires)))],
    [
      1000,
      () => {
        ;[setClients, setWires].map((f) =>
          f(modifyIndices(range(readers.length), setItemState("pending")))
        )
      },
    ],
    [800, () => setWires(drop(readerWires.length))],
    [1000, () => setClients(drop(readers.length))],
    [400, () => setServers(map(setItemData("b")))],
    [
      1000,
      () => {
        setServers(map(setTransaction("none")))
        setWires([])
      },
    ],
    [1000, () => setClients([])],
  ])
}

async function showWriteFail({ setServers, setClients, setWires }) {
  let clients = [[[1, 1], ["c"]]]
  let wires = wireClients(unzip(clients)[0], [range(5).map(prepend(2))])
  const active = [1, 2, 3]

  await delaySequence([
    [
      600,
      () => {
        setServers(modifyIndices([0, 4], setItemState("down")))
        setClients(createWriters(clients))
      },
    ],
    [800, () => setWires(wires)],
    [
      1000,
      () => {
        setWires(
          compose(
            modifyIndices([0, 4], setItemState("failure")),
            map(setItemState("success"))
          )
        )
        setServers(modifyIndices(active, setTransaction("write")))
      },
    ],
    [1000, () => setClients(map(setItemState("failure")))],
    [1000, () => setClients(map(setItemState("ready")))],
    [500, () => setServers(modifyIndices(active, setItemData("c")))],
    [
      1000,
      () => {
        setWires(drop(1))
        setServers(modifyIndex(0, setItemState("ready")))
      },
    ],
    [1000, () => setClients(prepend(...createRegularClients([[3, 0]])))],
    [
      2500,
      () => {
        setWires(prepend(...wireClients([[3, 0]], [[[2, 0]]])))
        setWires(modifyIndex(0, setItemState("success")))
      },
    ],
    [300, () => setServers(map(setItemData("b")))],
    [
      1000,
      () => {
        setWires([])
        setServers(map(setTransaction("none")))
      },
    ],
    [1000, () => setClients(take(1))],
    [
      1000,
      () => {
        setClients([])
        setServers(map(setItemState("ready")))
      },
    ],
  ])
}
