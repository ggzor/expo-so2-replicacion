import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import { range } from "lodash-es"
import { delay } from "blend-promise-utils"
import { lensPath, set, compose } from "rambda"
import { animated, useTransition, config } from "react-spring"
import styled from "styled-components"

import { Canvas } from "./canvas/Canvas"

const App = () => {
  const initialServers = range(5).map((column) => ({
    row: 2,
    column,
    data: "a",
    state: "ready",
    transaction: "none",
  }))

  initialServers[3].transaction = "read"
  initialServers[0].state = "down"

  const [servers, setServers] = useState(initialServers)

  const initialClients = [
    [0, 2],
    [3, 3],
  ].map(([row, column]) => ({ row, column, action: "read", state: "ready" }))

  initialClients[0].action = "write"
  initialClients[0].data = "b"
  initialClients[1].state = "pending"

  const initialWires = [
    ...range(5).map((column) => [
      [0, 2],
      [2, column],
    ]),
    [
      [3, 3],
      [2, 3],
    ],
  ].map(([start, end]) => ({ start, end, state: "success" }))

  initialWires[0].state = "failure"
  initialWires[5].state = "pending"

  const [wires, setWires] = useState(initialWires)
  const [clients, setClients] = useState(initialClients)

  useEffect(() => {
    async function run() {
      await delay(2000)
      setClients(set(lensPath([0, "data"]), "c", clients))
    }

    run()
  }, [])

  const weakWires = [{ start: [0, 2], end: [2, 3], progress: 0.4 }]
  const regions = [{ start: [2, 1], end: [2, 3], kind: "read" }]

  const width = 5
  const height = 4
  const cellSize = 64
  const gap = 32

  return (
    <Canvas
      {...{
        width,
        height,
        cellSize,
        gap,
        clients,
        wires,
        servers,
        weakWires,
        regions,
      }}
    />
  )
}

render(<App />, document.getElementById("app"))
