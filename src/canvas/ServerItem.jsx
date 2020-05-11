import { Circle, Icon, DataCircle } from "./common"

import * as React from "react"
import { useState, useEffect } from "react"

import styled from "styled-components"
import { animated, useTransition, config } from "react-spring"

const ServerItemLayout = styled(animated.div)`
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

const serverItemColorForState = {
  ready: "#52E099",
  down: "#999999",
}

export const ServerItem = ({
  votes,
  transaction,
  data,
  row,
  column,
  size,
  state,
}) => {
  return (
    <ServerItemLayout {...{ row, column }}>
      <Circle
        style={{ gridColumn: "1/4", gridRow: "1" }}
        color={serverItemColorForState[state]}
        size={size}
      />
      <Icon
        style={{ opacity: state === "ready" ? 1 : 0.7 }}
        row="1"
        column="2"
        className="fas fa-server"
      />
      <DataCircle
        style={{
          gridColumn: 2,
          gridRow: 1,
          alignSelf: "end",
          transform: `translateY(${size / 6}px)`,
        }}
        color="white"
        size={size / 3}
      >
        {data}
      </DataCircle>
      {votes && (
        <VowRect style={{ gridColumn: 2, gridRow: 1, alignSelf: "start" }}>
          {votes}
        </VowRect>
      )}
      <TransactionCircle size={size} transaction={transaction} />
    </ServerItemLayout>
  )
}

const VowRect = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background: #52b6e0;
  border-radius: 2px;
  padding: 2px 4px;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;

  color: #ffffff;
`

const TransactionCircleBase = animated(styled(Circle)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 11px;
  color: rgba(0, 0, 0, 0.5);
`)

const TransactionCircle = ({ transaction, size }) => {
  const [item, setItem] = useState(transaction)
  const animation = useTransition(item, null, {
    from: { transform: "scale(0, 0)" },
    enter: { transform: "scale(1, 1)" },
    leave: { transform: "scale(0, 0)" },
    config: config.wobbly,
  })

  useEffect(() => setItem(transaction), [transaction])

  return animation.map(({ item: transaction, key, props }) => {
    return (
      transaction !== "none" && (
        <TransactionCircleBase
          key={key}
          style={{
            gridRow: 1,
            gridColumn: 3,
            alignSelf: "start",
            transformOrigin: "50% 50%",
            ...props,
          }}
          color="white"
          size={size / 4}
        >
          {transaction === "read" ? "R" : "W"}
        </TransactionCircleBase>
      )
    )
  })
}
