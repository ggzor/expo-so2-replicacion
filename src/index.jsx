import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import range from "lodash-es/range"
import { delay } from "blend-promise-utils"
import {
  lensPath,
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
} from "rambda"
import { animated, useTransition, config } from "react-spring"
import styled from "styled-components"

import { Canvas } from "./canvas/Canvas"
import { Drawer } from "./Drawer"
import { MainLayout, CanvasLayout } from "./layout"

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

    console.log(choosePositions({ width, height, servers, clients }))

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

    const wireClients = (clients, wires) =>
      zip(clients, wires).flatMap(([start, targets]) =>
        targets.map((end) => ({ start, end, state: "none" }))
      )

    const delaySequence = async (spec) => {
      for (let [postDelay, action] of spec) {
        if (action) {
          let result = action()
          if (result && typeof result.then === "function") await result
        }
        await delay(postDelay)
      }
    }

    const setterFor = (lens) => (state) => set(lens, state)
    const setterForProp = (prop) => setterFor(lensProp(prop))

    const setItemState = setterForProp("state")
    const setItemAction = setterForProp("action")
    const setItemData = setterForProp("data")
    const setItemTransaction = setterForProp("transaction")

    const modifyIndex = (index, op) => over(lensIndex(index), op)
    const modifyIndices = (indices, op) =>
      compose(...indices.map((i) => modifyIndex(i, op)))

    async function run() {
      await delay(2000)
      let c1 = [
        [0, 0],
        [1, 3],
        [3, 3],
      ]
      let w1 = [[[2, 0]], [[2, 3]], [[2, 3]]]

      let clients1 = createRegularClients(c1)
      for await (let i of stagger(3, 300)) setClients(clients1.slice(0, i + 1))
      await delay(600)

      setWires(wireClients(c1, w1))
      await delay(800)

      setWires(map(setItemState("success")))
      await delay(1000)

      setWires([])
      await delay(1000)

      setClients([])
      await delay(1000)

      setServers((servers) =>
        compose(...[1, 4].map((i) => set(lensPath([i, "state"]), "down")))(
          servers
        )
      )
      await delay(1000)

      let c2 = [[1, 1]]
      setClients(createRegularClients(c2))
      await delay(600)

      let w2 = [
        [
          [2, 1],
          [2, 2],
        ],
      ]
      let wires2 = wireClients(c2, w2)

      await delaySequence([
        [600, () => setWires(append(wires2[0]))],
        [400, () => setWires(modifyIndex(0, setItemState("failure")))],
        [600, () => setWires(append(wires2[1]))],
        [400, () => setWires(modifyIndex(1, setItemState("success")))],
        [1000],
        [1000, () => setWires([])],
      ])

      setClients([])
      await delay(400)

      setServers(map(setItemState("ready")))
      await delay(2000)

      let c3 = [[1, 2]]
      setClients(
        map(
          compose(setItemAction("write"), setItemData("b")),
          createRegularClients(c3)
        )
      )
      await delay(600)

      let wires3 = wireClients(c3, [range(5).map(prepend(2))])
      setWires(wires3)
      await delay(800)

      setWires(map(setItemState("success")))
      setServers(map(setItemTransaction("write")))
      await delay(1000)

      let c4 = [
        [3, 1],
        [3, 3],
      ]
      let w4 = [[[2, 1]], [[2, 3]]]

      setClients(concat(createRegularClients(c4)))
      await delay(600)

      setWires(concat(wireClients(c4, w4)))
      await delay(800)
      ;[setClients, setWires].map((f) =>
        f(
          compose(
            ...range(c4.length).map((i) =>
              modifyIndex(i, setItemState("pending"))
            )
          )
        )
      )
      await delay(1000)

      setWires(drop(w4.length))
      await delay(800)

      setClients(drop(c4.length))
      await delay(1000)

      setServers(map(setItemData("b")))
      await delay(400)

      setServers(map(setItemTransaction("none")))
      setWires([])
      await delay(1000)

      setClients([])
      await delay(1000)

      setServers(
        compose(...[0, 4].map((i) => modifyIndex(i, setItemState("down"))))
      )

      let c5 = [[1, 1]]
      setClients(
        map(
          compose(setItemAction("write"), setItemData("c")),
          createRegularClients(c5)
        )
      )
      await delay(600)

      let wires4 = wireClients(c5, [range(5).map(prepend(2))])
      setWires(wires4)
      await delay(800)

      setWires(
        compose(
          modifyIndices([0, 4], setItemState("failure")),
          map(setItemState("success"))
        )
      )
      setServers(modifyIndices([1, 2, 3], setItemTransaction("write")))
      await delay(1000)

      setClients(map(setItemState("failure")))
      await delay(1000)

      setClients(map(setItemState("ready")))
      await delay(1000)

      setServers(modifyIndices([1, 2, 3], setItemData("c")))
      await delay(500)

      setWires(drop(1))
      setServers(modifyIndex(0, setItemState("ready")))
      await delay(1000)

      setClients(prepend(...createRegularClients([[3, 0]])))
      await delay(1000)

      setWires(prepend({ start: [3, 0], end: [2, 0], state: "success" }))
      await delay(2500)

      setServers(map(setItemData("b")))
      await delay(300)

      setWires([])
      setServers(map(setItemTransaction("none")))
      await delay(1000)

      setClients(take(1))
      await delay(1000)

      setClients([])
      setServers(map(setItemState("ready")))
      await delay(1000)
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
