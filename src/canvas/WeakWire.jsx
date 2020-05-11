import * as React from "react"
import { animated } from "react-spring"
import {
  normalizeGridCoordinates,
  toRelativeGridCoordinate,
} from "../gridUtils"

const WeakWireBase = (props) => {
  const { start, end, opacity } = props
  const [row, column] = normalizeGridCoordinates(start, end)

  const [[sy, sx], [ey, ex]] = toRelativeGridCoordinate(props)

  return (
    <div
      style={{
        gridColumn: column,
        gridRow: row,
        zIndex: -2,
        opacity,
      }}
    >
      <svg
        style={{ width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeDasharray="0.05 0.05"
          pathLength="1"
          strokeOpacity="0.5"
          d={`M ${sx} ${sy} L ${ex} ${ey}`}
          fill="transparent"
          stroke="black"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

export const WeakWire = animated(WeakWireBase)
