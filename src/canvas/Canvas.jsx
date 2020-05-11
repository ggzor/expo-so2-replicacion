import { ServerItem } from "./ServerItem"
import { WireItem } from "./WireItem"
import { ClientItem } from "./ClientItem"
import { WeakWire } from "./WeakWire"

import * as React from "react"
import { useEffect, useState } from "react"

import styled from "styled-components"
import { useTransition } from "react-spring"

const CanvasLayout = styled.div`
  display: grid;
  ${({ width, height, cellSize, gap }) => `
    grid-template-rows: repeat(${height}, ${cellSize}px);
    grid-template-columns: repeat(${width}, ${cellSize}px);
    grid-gap: ${gap || 0}px;
  `}
`

export const Canvas = (props) => {
  const { cellSize, gap } = props

  const [weakWires, setWeakWires] = useState(props.weakWires)
  useEffect(() => setWeakWires(props.weakWires), [props.weakWires])
  const weakWireItems = useTransition(
    weakWires,
    (w) => `weak: ${w.start[0]},${w.start[1]} ${w.end[0]},${w.end[1]}`,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: { mass: 35, tension: 380, friction: 170 },
    }
  )

  const [wires, setWires] = useState(props.wires)
  useEffect(() => setWires(props.wires), [props.wires])
  const wireItems = useTransition(
    wires,
    (w) => `${w.start[0]},${w.start[1]} ${w.end[0]},${w.end[1]}`,
    {
      from: { progress: 0 },
      enter: { progress: 1 },
      leave: { progress: 0 },
      config: { mass: 35, tension: 380, friction: 170 },
    }
  )

  const [clients, setClients] = useState(props.clients)
  useEffect(() => setClients(props.clients), [props.clients])
  const clientItems = useTransition(clients, (c) => `${c.row},${c.column}`, {
    from: { opacity: 0.5, transform: "scale(0.85, 0.85)" },
    enter: { opacity: 1, transform: "scale(1, 1)" },
    leave: { opacity: 0, transform: "scale(0.85, 0.85)" },
  })

  return (
    <CanvasLayout {...props}>
      {weakWireItems.map(({ item, key, props }) => {
        return <WeakWire key={key} {...{ ...item, ...props, cellSize, gap }} />
      })}
      {wireItems.map(({ item, key, props }) => {
        return <WireItem key={key} {...{ ...item, ...props, cellSize, gap }} />
      })}
      {clientItems.map(({ item, key, props }) => {
        return (
          <ClientItem
            key={key}
            {...{ ...item, ...props, size: cellSize, gap }}
          />
        )
      })}
      {props.servers.map((s) => (
        <ServerItem
          key={`server: ${s.row},${s.column}`}
          {...{ ...s, size: cellSize, gap }}
        />
      ))}
    </CanvasLayout>
  )
}
