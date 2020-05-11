import { Circle, Icon, DataCircle } from "./common"

import * as React from "react"

import styled from "styled-components"
import { animated } from "react-spring"

const ClientItemLayout = animated(styled.div`
  ${({ row, column }) => `
    grid-row: ${row + 1};
    grid-column: ${column + 1};
  `}

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
`)

const clientItemColorForState = {
  ready: "#52B6E0",
  pending: "#E0E052",
}

export const ClientItem = (props) => {
  const { action, data, row, column, size, state, opacity, transform } = props
  return (
    <ClientItemLayout
      {...{ row, column }}
      style={{ opacity, transform, transformOrigin: "50% 50%" }}
    >
      <Circle
        style={{ gridColumn: 1, gridRow: 1 }}
        color={clientItemColorForState[state]}
        size={size}
      />
      <Icon row="1" column="1" className="fas fa-desktop" />
      {action === "write" && (
        <Icon
          style={{ transform: "translate(0.7em, 0.7em)" }}
          size="0.8"
          row="1"
          column="1"
          className="fas fa-pen"
        />
      )}
      {action === "write" && data && (
        <DataCircle
          color="white"
          size={size / 3}
          style={{
            gridColumn: 1,
            gridRow: 1,
            alignSelf: "end",
            transform: `translateY(${size / 6}px)`,
          }}
        >
          {data}
        </DataCircle>
      )}
    </ClientItemLayout>
  )
}
