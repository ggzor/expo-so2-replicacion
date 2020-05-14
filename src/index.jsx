import React, { useState, useEffect } from "react"
import "regenerator-runtime/runtime"
import { render } from "react-dom"
import range from "lodash-es/range"
import { delay } from "blend-promise-utils"

import { Canvas } from "./canvas/Canvas"
import { Drawer } from "./Drawer"
import { MainLayout, CanvasLayout } from "./layout"
import { ROWAChoreography, ROWARequirements } from "./choreographies/ROWA"
import { QuorumRequirements, QuorumChoreography } from "./choreographies/Quorum"

const App = () => {
  const requirements = QuorumRequirements
  const choreography = QuorumChoreography

  const initialServers = range(requirements.servers).map((column) => ({
    row: requirements.serversRow,
    column,
    data: "a",
    state: "ready",
    transaction: "none",
  }))

  const [servers, setServers] = useState(initialServers)
  const [wires, setWires] = useState([])
  const [clients, setClients] = useState([])
  const [regions, setRegions] = useState([])
  const weakWires = []
  const width = requirements.width
  const height = requirements.height
  const cellSize = isSmall ? 48 : 64
  const gap = isSmall ? 24 : 32

  const isSmall = Math.min(screen.width, screen.height) < 768

  const canvasProps = {
    width,
    height,
    cellSize,
    gap,
    clients,
    servers,
    wires,
    weakWires,
    regions,
  }

  const canvasControllers = {
    setWires,
    setClients,
    setServers,
    setRegions,
    params: {
      cellSize,
      gap,
    },
  }

  useEffect(() => {
    async function run() {
      await choreography(canvasControllers)
    }

    run()
  }, [])

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
