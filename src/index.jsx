import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import range from "lodash-es/range"
import { delay } from "blend-promise-utils"

import { Canvas } from "./canvas/Canvas"
import { Drawer } from "./Drawer"
import { MainLayout, CanvasLayout } from "./layout"
import { ROWAChoreography } from "./choreographies/ROWA"

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

  const canvasControllers = { setWires, setClients, setServers }

  useEffect(() => {
    async function run() {
      await delay(2000)
      await ROWAChoreography(canvasControllers)
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
