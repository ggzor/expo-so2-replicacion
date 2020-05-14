import {
  modifyIndex,
  setVotes,
  setItemState,
  setTransaction,
  modifyIndices,
  setItemData,
} from "./lenses"
import { delaySequence, delayTraverse } from "./timing"
import {
  createRegularClients,
  wireClients,
  createReadRegions,
  createWriteRegions,
  createWriters,
} from "./utils"

import range from "lodash-es/range"
import unzip from "lodash-es/unzip"
import { map, compose, append, prepend, drop } from "rambda"
import { delay } from "blend-promise-utils"

export const QuorumRequirements = {
  servers: 3,
  serversRow: 2,
  width: 3,
  height: 4,
}

export const QuorumChoreography = async (canvasProps) => {
  const votes = [1, 1, 2]

  const regions = [
    [
      [2, 0],
      [2, 1],
    ],
    [
      [2, 2],
      [2, 2],
    ],
    [
      [2, 1],
      [2, 2],
    ],
  ]

  const readRegions = createReadRegions(regions, canvasProps.params)
  const writeRegions = createWriteRegions(regions, canvasProps.params)

  await delay(2000)
  votes.map((v, i) => canvasProps.setServers(modifyIndex(i, setVotes(v))))
  await delay(1000)

  await delay(20000)

  await showSimpleRead(canvasProps, { readRegions })
  await showMultipleRead(canvasProps, { readRegions })
  await delay(3000)
  await showWrite(canvasProps, { readRegions, writeRegions })
  await showReadAfter(canvasProps, { readRegions, writeRegions })
}

async function showSimpleRead(
  { setServers, setClients, setWires, setRegions, params },
  { readRegions: [leftR, rightR, rightCenterR] }
) {
  const [clients, wires] = unzip([
    [
      [0, 0],
      [
        [2, 0],
        [2, 1],
      ],
    ],
  ])

  await delaySequence([
    [1000, () => setRegions([rightR])],
    [1000, () => setRegions([rightCenterR])],
    [5000, () => setRegions([leftR])],
    [800, () => setClients(createRegularClients(clients))],
    [800, () => setWires(wireClients(clients, wires))],
    [5000, () => setWires(map(setItemState("success")))],
    [5000, () => setServers(modifyIndex(2, setItemState("down")))],
    [1000, () => setServers(modifyIndex(2, setItemState("ready")))],
    [1000, () => setWires([])],
    [800, () => setClients([])],
    [400, () => setRegions([])],
  ])
}

async function showMultipleRead(
  { setServers, setClients, setWires, setRegions, params },
  { readRegions: [leftR, rightR, rightCenterR] }
) {
  let [clients, wires] = unzip([
    [
      [3, 0],
      [
        [2, 0],
        [2, 1],
      ],
    ],
    [[0, 2], [[2, 2]]],
  ])
  const items = createRegularClients(clients)

  await delaySequence([
    [1000, () => setRegions([leftR, rightR])],
    [600, () => delayTraverse(300, items, compose(setClients, append))],
    [1000, () => setWires(wireClients(clients, wires))],
    [800, () => setWires(map(setItemState("success")))],
    [1000],
    [1000, () => setWires([])],
    [1000, () => setClients([])],
    [1000, () => setRegions([])],
  ])
}

async function showWrite(
  { setServers, setClients, setWires, setRegions, params },
  {
    readRegions: [leftR, rightR, rightCenterR],
    writeRegions: [leftW, rightW, rightCenterW],
  }
) {
  let writers = [[[1, 2], "b"]]
  let writerWires = wireClients(unzip(writers)[0], [
    range(1, 3).map((i) => [2, i]),
  ])

  let [readers, readerWires] = unzip([[[3, 0], [[2, 0]]]])

  await delaySequence([
    [8000, () => setRegions([rightCenterW])],
    [1000, () => setClients(createWriters(writers))],
    [
      1000,
      () => {
        setWires(writerWires)
        setServers(modifyIndices([1, 2], setTransaction("write")))
      },
    ],
    [8000, () => setWires(map(setItemState("success")))],
    [1000, () => setClients(prepend(...createWriters([[[0, 0], "c"]])))],
    [1000, () => setWires(prepend(...wireClients([[0, 0]], [[[2, 0]]])))],
    [
      1000,
      () => {
        setWires(modifyIndex(0, setItemState("pending")))
        setClients(modifyIndex(0, setItemState("pending")))
      },
    ],
    [1000, () => setWires(drop(1))],
    [1000, () => setClients(drop(1))],
    [3000],
    [1000, () => setClients(prepend(...createRegularClients([[3, 0]])))],
    [1000, () => setWires(prepend(...wireClients([[3, 0]], [[[2, 0]]])))],
    [
      1000,
      () => {
        setWires(modifyIndex(0, setItemState("pending")))
        setClients(modifyIndex(0, setItemState("pending")))
      },
    ],
    [2000],
    [1000, () => setWires(drop(1))],
    [1000, () => setClients(drop(1))],
    [2000],
    [6000, () => setServers(modifyIndex(0, setItemState("down")))],
    [2000, () => setServers(modifyIndex(0, setItemState("ready")))],
    [
      1000,
      () => {
        setServers(modifyIndices([1, 2], setItemData("b")))
        setServers(map(setTransaction("none")))
        setWires([])
      },
    ],
    [
      1000,
      () => {
        setClients([])
        setRegions([])
      },
    ],
  ])
}

async function showReadAfter(
  { setServers, setClients, setWires, setRegions, params },
  {
    readRegions: [leftR, rightR, rightCenterR],
    writeRegions: [leftW, rightW, rightCenterW],
  }
) {
  const [clients, wires] = unzip([
    [
      [0, 1],
      [
        [2, 0],
        [2, 1],
      ],
    ],
  ])

  await delaySequence([
    [5000, () => setRegions([leftR])],
    [800, () => setClients(createRegularClients(clients))],
    [800, () => setWires(wireClients(clients, wires))],
    [3000, () => setWires(map(setItemState("success")))],
    [20000, () => setRegions(prepend(rightCenterW))],
    [1000, () => setWires([])],
    [800, () => setClients([])],
    [400, () => setRegions([])],
  ])
}
