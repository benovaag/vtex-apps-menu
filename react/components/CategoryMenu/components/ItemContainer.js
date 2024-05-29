import React, { useState, useEffect, useRef, memo } from 'react'

import { Container } from 'vtex.store-components'

import styles from '../categoryMenu.css'
import SubMenuItem from './SubMenuItem'

import ItemImage from './ItemImage'

const ItemContainer = ({
  setOpenMenu,
  openMenu,
  menuRef,
  isAllDepartments,
  category,
  images
}) => {
  return (
    <Container className={`${styles.submenu_container}`}>
      {
        <>
          <SubMenuItem
            setOpenMenu={setOpenMenu}
            openMenu={openMenu}
            menuRef={menuRef}

            isAllDepartments={isAllDepartments}
            classCustom={''}
            category={category}
            nivel={0}
          />

          {/* {images &&
            <ItemImage
              category={category}
              images={images}
            />
          } */}

        </>
      }
    </Container>
  )
}

export default memo(ItemContainer)
