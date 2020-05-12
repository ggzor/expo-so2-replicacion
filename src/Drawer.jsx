import * as React from "react"
import styled from "styled-components"

export const Drawer = ({}) => {
  return (
    <DrawerLayout>
      <DrawerTopItems>
        <DrawerTitle>Read One Write All (ROWA)</DrawerTitle>
        <DrawerInfo>
          En esta estrategia de replicación la lectura se puede realizar desde
          cualquier nodo que se encuentre activo, sin embargo, la escritura sólo
          se puede llevar a cabo cuando todos los nodos están activos.
        </DrawerInfo>
      </DrawerTopItems>
      <DrawerBottomItems></DrawerBottomItems>
    </DrawerLayout>
  )
}

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
