import * as React from "react"
import { useState, useEffect } from "react"

import styled from "styled-components"
import { animated, useTransition } from "react-spring"

export const Circle = styled.div`
  ${({ size }) => `width: ${size}px; height: ${size}px;`}
  border-radius: 50%;
  background-color: ${({ color }) => color};
  transition: 0.5s all ease-out;
`

const DataCircleBase = styled(Circle)`
  display: grid;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const DataCircleText = animated(styled.span`
  grid-row: 1;
  grid-column: 1;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0.7);
`)

export const DataCircle = (props) => {
  const [text, setText] = useState(props.text)
  useEffect(() => setText(props.text), [props.text])
  const textTransitions = useTransition(text, null, {
    from: { opacity: 0 },
    enter: { opacity: 1, transform: "translateX(0px)" },
    leave: { opacity: 0, transform: `translateX(${-props.size / 2}px)` },
  })

  return (
    <DataCircleBase {...props}>
      {textTransitions.map(({ item, key, props }) => {
        return (
          <DataCircleText key={key} style={{ ...props }}>
            {item}
          </DataCircleText>
        )
      })}
    </DataCircleBase>
  )
}

export const Icon = styled.i`
  font-size: ${({ size }) => size || 1.2}em;
  color: white;
  ${({ row, column }) => `grid-row: ${row}; grid-column: ${column};`}
  transition: 0.5s all;
`
