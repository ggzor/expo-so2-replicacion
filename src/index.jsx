import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import { range } from "lodash-es"
import { delay } from "blend-promise-utils"
import { lensPath, set, compose } from "rambda"
import { animated, useTransition, config } from "react-spring"
import styled from "styled-components"

import { Canvas } from "./canvas/Canvas"

const MainLayout = styled.section`
  display: grid;
  grid-template-rows: 1fr auto;

  @media (min-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
  }

  @media (max-width: 767px) and (orientation: landscape) {
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
  }

  height: 100%;
  width: 100%;
`

const DrawerLayout = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;

  grid-column: 1;
  grid-row: 2;

  @media (max-width: 767px) and (orientation: landscape) {
    width: 250px;
    height: 100%;
    grid-row: 1;
    grid-column: 1;
  }

  @media (min-width: 768px) {
    width: 320px;
    height: 100%;
    grid-row: 1;
    grid-column: 1;
  }

  border: 1px solid #dbdbdb;
  padding: 16px;
`

const DrawerTitle = styled.h2`
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  letter-spacing: -0.05em;

  color: rgba(0, 0, 0, 0.7);
`

const DrawerInfo = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  text-align: justify;

  color: rgba(0, 0, 0, 0.7);
`

const DrawerTopItems = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 1;
`
const DrawerBottomItems = styled.div`
  grid-row: 2;
`

const CanvasLayout = styled.section`
  grid-row: 1;
  grid-column: 1;

  overflow: auto;

  @media (max-width: 767px) and (orientation: landscape) {
    grid-row: 1;
    grid-column: 2;
  }

  @media (min-width: 768px) {
    grid-row: 1;
    grid-column: 2;
  }

  display: flex;
  align-items: center;
  justify-content: center;
`

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
  const cellSize = 48
  const gap = 24

  return (
    <MainLayout>
      <DrawerLayout>
        <DrawerTopItems>
          <DrawerTitle>Read One Write All (ROWA)</DrawerTitle>
          <DrawerInfo>
            En esta estrategia de replicación la lectura se puede realizar desde
            cualquier nodo que se encuentre activo, sin embargo, la escritura
            sólo se puede llevar a cabo cuando todos los nodos están activos.
          </DrawerInfo>
        </DrawerTopItems>
        <DrawerBottomItems></DrawerBottomItems>
      </DrawerLayout>
      <CanvasLayout>
        {" "}
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
      </CanvasLayout>
    </MainLayout>
  )
}

render(<App />, document.getElementById("app"))
