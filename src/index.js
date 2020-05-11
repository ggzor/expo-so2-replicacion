import React from "react"
import { render } from "react-dom"
import { range } from "lodash-es"
import styled from "styled-components"

const CanvasLayout = styled.div`
  display: grid;
  ${({ width, height, cellSize, gap }) => `
    grid-template-rows: repeat(${height}, ${cellSize}px);
    grid-template-columns: repeat(${width}, ${cellSize}px);
    grid-gap: ${gap || 0}px;
  `}
`
const ServerItemLayout = styled.div`
  ${({ row, column }) => `
    grid-row: ${row + 1};
    grid-column: ${column + 1};
  `}

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`
const ClientItemLayout = styled.div`
  ${({ row, column }) => `
    grid-row: ${row + 1};
    grid-column: ${column + 1};
  `}

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
`
const WireItemLayout = styled.div``

const Circle = styled.div`
  ${({ size }) => `width: ${size}px; height: ${size}px;`}
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

const ShadowCircle = styled(Circle)`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const TransactionCircle = styled(Circle)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 11px;
  color: rgba(0, 0, 0, 0.5);
`

const DataText = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0.7);
`

const Icon = styled.i`
  font-size: 1.2em;
  color: white;
  ${({ row, column }) => `grid-row: ${row}; grid-column: ${column};`}
`

const WireItem = ({}) => {
  return <WireItemLayout></WireItemLayout>
}

const clientItemColorForState = {
  ready: "#52B6E0",
}
const ClientItem = ({ row, column, size, state }) => {
  const color = clientItemColorForState[state]

  return (
    <ClientItemLayout {...{ row, column }}>
      <Circle style={{ gridColumn: 1, gridRow: 1 }} color={color} size={size} />
      <Icon row="1" column="1" className="fas fa-desktop" />
    </ClientItemLayout>
  )
}

const serverItemColorForState = {
  ready: "#52E099",
}
const ServerItem = ({ transaction, data, row, column, size, state }) => {
  const color = serverItemColorForState[state]
  return (
    <ServerItemLayout {...{ row, column }}>
      <Circle
        style={{ gridColumn: "1/4", gridRow: "1" }}
        color={color}
        size={size}
      />
      <Icon row="1" column="2" className="fas fa-server" />
      <ShadowCircle
        style={{
          gridColumn: 2,
          gridRow: 1,
          alignSelf: "end",
          transform: `translateY(${size / 6}px)`,
        }}
        color="white"
        size={size / 3}
      />
      <DataText
        style={{
          gridRow: 1,
          gridColumn: 2,
          alignSelf: "end",
          transform: `translateY(${size / 8}px)`,
          zIndex: 100,
        }}
      >
        {data}
      </DataText>
      {transaction && transaction !== "none" && (
        <TransactionCircle
          style={{ gridRow: 1, gridColumn: 3, alignSelf: "start" }}
          color="white"
          size={size / 4}
        >
          {transaction === "read" ? "R" : "W"}
        </TransactionCircle>
      )}
    </ServerItemLayout>
  )
}

const Canvas = (props) => {
  const { children } = props
  console.log(children)
  return <CanvasLayout {...props}>{children}</CanvasLayout>
}

const App = () => {
  const servers = range(5).map((column) => ({
    row: 2,
    column,
    data: "a",
    state: "ready",
    transaction: "none",
  }))

  servers[0].transaction = "read"
  servers[3].transaction = "read"

  const clients = [
    [0, 0],
    [1, 3],
    [3, 3],
  ].map(([row, column]) => ({ row, column, action: "read", state: "ready" }))

  const wires = [
    [
      [0, 0],
      [2, 0],
    ],
    [
      [1, 3],
      [2, 3],
    ],
    [
      [3, 3],
      [2, 3],
    ],
  ].map(([start, end]) => ({ start, end, kind: "success" }))

  const width = 5
  const height = 4
  const cellSize = 64
  const gap = 32

  return (
    <Canvas {...{ width, height, cellSize, gap }}>
      {wires.map((data, idx) => (
        <WireItem key={`wire-${idx}`} {...data} size={cellSize}></WireItem>
      ))}
      {clients.map((data, idx) => (
        <ClientItem
          key={`client-${idx}`}
          {...data}
          size={cellSize}
        ></ClientItem>
      ))}
      {servers.map((data, idx) => (
        <ServerItem
          key={`server-${idx}`}
          {...data}
          size={cellSize}
        ></ServerItem>
      ))}
    </Canvas>
  )
}

render(<App />, document.getElementById("app"))
