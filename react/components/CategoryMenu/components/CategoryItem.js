import React, { useRef, memo, useState, useEffect } from 'react'
import classNames from 'classnames'

import { Link } from 'vtex.render-runtime'
import { useDevice } from "vtex.device-detector"

import ItemContainer from './ItemContainer'
import styles from '../categoryMenu.css'

const CategoryItem = ({
  category,
  images,
  isAllDepartments
}) => {
  const menuRef = useRef(null);
  const { isMobile } = useDevice()
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = (e) => {
    if(e.currentTarget.classList.contains(styles.menuOpen)){
      setOpenMenu(false)
    }else{
      setOpenMenu(true)
    }

  }

  let categoryId = category?.id;
  let isDirectLink = category?.isDirectLink
  let hasFeatured = category?.hasFeatured

  const menuItemClasses = classNames(
    styles.menu_item,
    { [styles.menu_all]: isAllDepartments },
    { [styles.menu_item_direct]: isDirectLink && !hasFeatured },
    { [styles.menu_item_featured]: hasFeatured },
    { [styles.menu_item_hasChildren] : (category?.showSubCategories && category?.hasChildren || isAllDepartments)},
    { [styles.menuOpen]: openMenu }
  );

  const menuLinkClasses = classNames(
    styles.menu_link,
    { [styles.menu_link_direct]: isDirectLink && !hasFeatured },
    { [styles.menu_link_featured]: hasFeatured }
  );

  useEffect(() => {
    // Função para lidar com o clique fora do elemento
    function handleCliqueFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }

    // Adiciona um event listener ao documento
    document.addEventListener('mousedown', handleCliqueFora);

    // Remove o event listener ao desmontar o componente
    return () => {
      document.removeEventListener('mousedown', handleCliqueFora);
    };
  }, []);

  return (
    <li className={menuItemClasses} onClick={(e) => toggleMenu(e)} categoryId={categoryId} ref={menuRef}>
      {
        (isAllDepartments) ?
          <div className={`${styles.menu_link}`}>
              {isMobile ? "Todos os departamentos" : "Ver todos"}
          </div>
         :
         ((category?.showSubCategories && (category?.hasChildren) || (isAllDepartments)) && isMobile) ?
            <div className={`${styles.menu_link}`}>
                {category?.name}
            </div>
          :
            <Link
                className={menuLinkClasses}
                to={category?.href}
                target={(category?.openNewPage) ? "_blank" : "_self"}
              >
                {category?.name}
            </Link>
      }

      {
        ((category?.showSubCategories && category?.hasChildren) || (isAllDepartments)) &&
          <ItemContainer
            setOpenMenu={setOpenMenu}
            openMenu={openMenu}
            menuRef={menuRef}

            category={category}
            images={images}
          />
      }
    </li>
  )
}

export default memo(CategoryItem)
