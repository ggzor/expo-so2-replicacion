import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import range from "lodash-es/range"
import unzip from "lodash-es/unzip"
import { delay } from "blend-promise-utils"
import {
  lensPath,
  intersperse,
  set,
  compose,
  difference,
  zip,
  lensProp,
  map,
  over,
  lensIndex,
  append,
  prepend,
  concat,
  slice,
  drop,
  take,
  type,
} from "rambda"
import { animated, useTransition, config } from "react-spring"
import styled from "styled-components"

import { Canvas } from "./canvas/Canvas"
import { Drawer } from "./Drawer"
import { MainLayout, CanvasLayout } from "./layout"
import { create } from "lodash-es"

const App = () => {
  const initialServers = range(5).map((column) => ({
    row: 2,
    column,
    data: "a",
    state: "ready",
    transaction: "none",
  }))
  const [servers, setServers] = useState(initialServers)
  const [wires, setWires] = useState([])
  const [clients, setClients] = useState([])
  const weakWires = []
  const regions = []
  const width = 5
  const height = 4

  useEffect(() => {
    const allPositions = ({ width, height }) =>
      range(height).flatMap((row) =>
        range(width).map((column) => [row, column])
      )

    const ocuppiedPositions = ({ servers, clients }) =>
      [servers, clients].flatMap((coll) => coll.map((i) => [i.row, i.column]))

    const freePositions = (props) =>
      difference(allPositions(props), ocuppiedPositions(props))

    const choosePositions = (props, count) => {}

    function allocateClients(count) {}

    async function* stagger(count, stepDelay) {
      for (let i of range(count)) {
        if (i > 0) await delay(stepDelay)
        yield i
      }
    }

    const createRegularClients = (clients) =>
      clients.map(([row, column]) => ({
        row,
        column,
        action: "read",
        state: "ready",
      }))

    const createWriters = (writers) => {
      const [coords, data] = unzip(writers)

      return zip(createRegularClients(coords), data).map(([client, data]) => ({
        ...client,
        action: "write",
        data,
      }))
    }

    const wireClients = (clients, wires) =>
      zip(clients, wires).flatMap(([start, targets]) =>
        targets.map((end) => ({ start, end, state: "none" }))
      )

    const delaySequence = async (spec) => {
      for (let [postDelay, action] of spec) {
        // Not delayed action
        if (action === undefined && typeof postDelay !== "number") {
          action = postDelay
          postDelay = undefined
        }

        // Call function and await if needed
        if (action) {
          let result = action()
          if (result && typeof result.then === "function") await result
        }

        if (postDelay) await delay(postDelay)
      }
    }

    const delayTraverse = (timeSeparator, items, action) =>
      delaySequence(
        intersperse(
          [timeSeparator],
          items.map((i) => [() => action(i)])
        )
      )

    const setterFor = (lens) => (state) => set(lens, state)
    const setterForProp = (prop) => setterFor(lensProp(prop))

    const setItemState = setterForProp("state")
    const setItemAction = setterForProp("action")
    const setItemData = setterForProp("data")
    const setTransaction = setterForProp("transaction")

    const modifyIndex = (index, op) => over(lensIndex(index), op)
    const modifyIndices = (indices, op) =>
      compose(...indices.map((i) => modifyIndex(i, op)))

    async function showRead() {
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

    async function showReadDown() {
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

    async function showWrite() {
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
          1000,
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

    async function showWriteFail() {
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

    async function run() {
      await delay(2000)
      await showRead()
      await showReadDown()
      await showWrite()
      await showWriteFail()
    }

    run()
  }, [])

  const isSmall = Math.min(screen.width, screen.height) < 768

  const canvasProps = {
    width,
    height,
    cellSize: isSmall ? 48 : 64,
    gap: isSmall ? 24 : 32,
    clients,
    servers,
    wires,
    weakWires,
    regions,
  }

  return (
    <MainLayout>
      <Drawer />
      <CanvasLayout>
        <Canvas {...canvasProps} />
      </CanvasLayout>
    </MainLayout>
  )
}

render(<App />, document.getElementById("app"))
