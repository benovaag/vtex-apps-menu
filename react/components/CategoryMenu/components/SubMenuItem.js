import React, { useState, useRef, memo } from 'react'

import { Link } from 'vtex.render-runtime'
import { useDevice } from "vtex.device-detector"

import styles from '../categoryMenu.css'

const SubMenuItem = ({
  setOpenMenu,
  openMenu,
  menuRef,
  isAllDepartments,
  classCustom,
  category
}) => {
  const { isMobile } = useDevice()

  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [openSubSubMenu, setOpenSubSubMenu] = useState(false);

  const backDepartamento = (categoryId, departamentoId) => {
    if (openMenu && !((openSubMenu[categoryId]) || (openSubSubMenu[categoryId]))) {
      // console.log("openMenu")
      setOpenMenu(false);
    }

    if(openSubMenu[categoryId]){
      // console.log("openSubMenu")
      toggleSubMenu(categoryId)
    }

    if(openSubSubMenu[categoryId]){
      // console.log("openSubSubMenu")
      toggleSubSubMenu(categoryId)
      toggleSubMenu(departamentoId)
    }
  }

  const toggleSubMenu = (departamentoId) => {
    // console.log("toggleSubMenu")
    setOpenSubMenu((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === departamentoId ? !prev[key] : false;
        return acc;
      }, {}),
      [departamentoId]: !prev[departamentoId]
    }));
  }

  const toggleSubSubMenu = (departamentoId, categoryId) => {
    // console.log("toggleSubSubMenu")
    setOpenSubSubMenu((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === categoryId ? !prev[key] : false;
        return acc;
      }, {}),
      [categoryId]: !prev[categoryId]
    }));
    toggleSubMenu(departamentoId)
  }

  const goLink = () => {
    // console.log("Fecha")
    setOpenMenu(false)
    setOpenSubMenu(false)
    setOpenSubSubMenu(false)

    var disclosureLayoutMenuTrigger = document.querySelector(".vtex-disclosure-layout-1-x-trigger--header-menu-mobile--visible");
    if (disclosureLayoutMenuTrigger) {
      disclosureLayoutMenuTrigger.click();
    }

    var disclosureLayoutMenuLinkTrigger = document.querySelector(".vtex-disclosure-layout-1-x-trigger--header-menu-links--visible");
    if (disclosureLayoutMenuLinkTrigger) {
      disclosureLayoutMenuLinkTrigger.click();
    }


  }

  if (!category?.children) return <></>
  return (
      <div className={`${styles[`submenu`]} ${(openMenu) ? styles[`submenuOpen`] : ``} ${classCustom}`} category-id={category?.id} ref={menuRef}>

        {(isMobile) && <div className={`${styles[`menu_back`]}`} onClick={() => backDepartamento(category?.id)}>Voltar</div>}
        {(isMobile) &&
          <Link
            to={category?.href}
            onClick={() => goLink()}
            className={`${styles[`menu_title`]}`}>
              {category?.name}{(!isAllDepartments) && <small>(ver todos)</small>}
          </Link>
        }

        <ul className={styles[`submenu_list`]}>
          
          {/* {console.log("departamento", category?.children !== 0)} */}
          {
            (category?.children)
              ?.sort((a, b) => {
                return a?.name.localeCompare(b?.name, 'pt-BR', { sensitivity: 'base' });
              })
              ?.map((children) => (
                <li
                  key={children?.id}
                  category-id={children?.id}
                  className={`${styles[`submenu_item`]} ${(children?.children != 0) ? styles[`submenu_item_hasChildren`] :``}`}
                >
                  {((isMobile) && (children?.hasChildren)) ?
                      <span
                        className={styles[`submenu_link`]}
                        onClick={() => toggleSubMenu(children?.id)}
                        id={children?.id}
                      >
                        {children?.name}
                      </span>
                    :
                      <Link
                        to={children?.href}
                        onClick={() => goLink()}
                        className={styles[`submenu_link`]}
                      >
                        {children?.name}
                      </Link>
                  }

                  {console.log("Categoria", children?.children !== 0)}
                  {(children?.hasChildren) &&
                    <div className={`${styles[`subsubmenu`]} ${(openSubMenu[children?.id]) ? styles[`subsubmenuOpen`] : ``} ${classCustom}`}>

                      {(isMobile) && <div className={`${styles[`menu_back`]}`} onClick={() => backDepartamento(children?.id)}>Voltar</div>}
                      {(isMobile) &&
                        <Link
                          to={children?.href}
                          className={`${styles[`menu_title`]}`}>
                            {children?.name}{(!isAllDepartments) && <small>(ver todos)</small>}
                        </Link>
                      }

                      <ul className={styles[`subsubmenu_list`]}>
                        {
                          (children?.children)
                            ?.sort((a, b) => {
                              return a?.name > b?.name ? 1 : -1
                            })
                            ?.map((grandChildren) => (
                              <li
                                key={grandChildren?.id}
                                children-id={grandChildren?.id}
                                className={`${styles[`subsubmenu_item`]} ${(grandChildren?.children != 0) ? styles[`subsubmenu_item_hasChildren`] :``}`}
                              >                      
                                {/* {console.log(grandChildren?.children !== 0)} */}
                                {((isMobile) && (grandChildren?.hasChildren)) ?
                                    <span
                                      className={styles[`subsubmenu_link`]}
                                      onClick={() => toggleSubSubMenu(children?.id, grandChildren?.id)}
                                      id={grandChildren?.id}
                                    >
                                      {grandChildren?.name}
                                    </span>
                                  :
                                    <Link
                                      to={grandChildren?.href}
                                      onClick={() => goLink()}
                                      className={styles[`subsubmenu_link`]}
                                    >
                                      {grandChildren?.name}
                                    </Link>
                                }

                                {/* {console.log("Subcategoria", grandChildren)} */}
                                {(grandChildren?.hasChildren) &&
                                  <div className={`${styles[`subsubsubmenu`]} ${(openSubSubMenu[grandChildren?.id]) ? styles[`subsubsubmenuOpen`] : ``} ${classCustom}`}>

                                    {(isMobile) && <div className={`${styles[`menu_back`]}`} onClick={() => backDepartamento(grandChildren?.id, children?.id)}>Voltar</div>}
                                    {(isMobile) &&
                                      <Link
                                        to={grandChildren?.href}
                                        onClick={() => goLink()}
                                        className={`${styles[`menu_title`]}`}>
                                          {grandChildren?.name}{(!isAllDepartments) && <small>(ver todos)</small>}
                                      </Link>
                                    }

                                    <ul className={styles[`subsubsubmenu_list`]}>
                                      {
                                        (grandChildren?.children)
                                          ?.sort((a, b) => {
                                            return a?.name > b?.name ? 1 : -1
                                          })
                                          ?.map((grandGrandChildren) => (
                                            <li
                                              key={grandGrandChildren?.id}
                                              children-id={grandChildren?.id}
                                              className={`${styles[`subsubsubmenu_item`]} ${(grandChildren?.children != 0) ? styles[`subsubsubmenu_item_hasChildren`] :``}`}
                                            >
                                                <Link
                                                  to={grandGrandChildren?.href}
                                                  onClick={() => goLink()}
                                                  className={styles[`subsubsubmenu_link`]}
                                                >
                                                  {grandGrandChildren?.name}
                                                </Link>
                                            </li>
                                          ))}
                                    </ul>
                                  </div>
                                }
                              </li>
                            ))}
                      </ul>
                    </div>
                  }
               </li>
              ))}
        </ul>
      </div>
  )
}

export default memo(SubMenuItem)
