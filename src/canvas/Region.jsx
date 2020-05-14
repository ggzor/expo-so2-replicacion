import * as React from "react"
import styled from "styled-components"
import { animated } from "react-spring"
import { normalizeGridCoordinates, getNormalizedCorners } from "../gridUtils"

const RegionBase = animated(styled.div`
  border: dashed 2px;
  border-color: ${({ kind }) => (kind === "read" ? "#52E099" : "#52B6E0")};
  align-self: center;
  justify-self: center;
`)

export const Region = (props) => {
  const { start, end, cellSize, gap } = props
  const [row, column] = normalizeGridCoordinates(start, end)

  const [[minY, maxY], [minX, maxX]] = getNormalizedCorners(start, end)

  const logicalHeight = maxY - minY + 1
  const logicalWidth = maxX - minX + 1

  const width = logicalWidth * cellSize + (logicalWidth - 1) * gap + gap
  const height = logicalHeight * cellSize + (logicalHeight - 1) * gap + gap

  return (
    <RegionBase
      kind={props.kind}
      style={{
        ...props,
        width,
        height,
        gridRow: row,
        gridColumn: column,
        zIndex: 200,
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  )
}
