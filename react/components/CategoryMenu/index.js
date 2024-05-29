import React from 'react'
import { useQuery } from 'react-apollo'

import { Container } from 'vtex.store-components'
import { useDevice } from "vtex.device-detector"

import getCategories from './queries/categoriesQuery.gql'

import CategoryItem from './components/CategoryItem'
import styles from './categoryMenu.css'

const CategoryMenu = ({
  showAllDepartments = true,
  showCategories = true,
  departmentsSchema = []
}) => {
  const { isMobile } = useDevice()
  const { loading, data } = useQuery(getCategories);

  if(loading) return <></>

  const { categories } = data
  const departmentsImage = departmentsSchema

  //Adiciona posições aos itens do Schema
  departmentsSchema = departmentsSchema?.map((item, index) => {
    return {
      ...item,
      position: index
    }
  })


  //Seleciona apenas os departamentos informados pelo usuário
  var departmentsSelected = []
  categories?.map(category =>{
    let positionItem = departmentsSchema?.filter((item) => { if(!item?.isDirectLink){ return item?.id === category?.id } } )[0]

    if(positionItem){
      category = {
        ...category,
        position: positionItem?.position
      }
      departmentsSelected?.push(category)
    }


    if(category?.hasChildren){
      let childrenList = category?.children
      childrenList?.map(children =>{
        let positionItemChildren = departmentsSchema?.filter((item) => { if(!item?.isDirectLink){ return item?.id === children?.id } } )[0]
        if(positionItemChildren){

          children.position = positionItemChildren?.position
          departmentsSelected?.push(children)
        }

        if(children?.hasChildren){
          let grandChildrenList = children?.children
          grandChildrenList?.map(grandChildren =>{
            let positionItemGrandChildren = departmentsSchema?.filter((item) => { if(!item?.isDirectLink){ return item?.id === grandChildren?.id } } )[0]
            if(positionItemGrandChildren){

              grandChildren.position = positionItemGrandChildren?.position
              departmentsSelected?.push(grandChildren)
            }
          })
        }
      })
    }

  })


  //Incluir os links direto ao mesmo array de itens que serão exibidos
  departmentsSchema
    ?.filter((a) => { return a?.isDirectLink == true })
    ?.map((el) => {
      departmentsSelected?.push({
        ...el
      })
    })

  departmentsSchema
    ?.map((b) => {
      departmentsSelected
        ?.map((c) => {
          if(b?.id == c?.id)
            c.showSubCategories = b?.showSubCategories
        })
    })


  //Ordenação pela posição - Caso não tenha departametos definidos, exibe apenas os primeiros 3 cadastrados na loja(categories?.slice(0, 3).
  let orderedDepartments = departmentsSelected?.length && departmentsSelected?.sort((a, b) => {return a?.position > b?.position ? 1 : -1})
  const visibleDepartments = orderedDepartments || categories?.slice(0, 3)

  //Desktop
  return (
    <nav className={`${styles.menu}`} style={{'display': 'none'}}>
      <Container
        className={`${styles.menu_container}`}
      >
        <ul className={`${styles.menu_list}`}>

          {showAllDepartments &&
            <CategoryItem
              category={{
                name: "Departamentos",
                id: 9999,
                hasChildren: true,
                children: categories
              }}
              images={[]}
              isAllDepartments={true}
            />
          }

          {showCategories &&
            visibleDepartments?.map(category => (
              <CategoryItem
                category={category}
                images={departmentsImage}
                isAllDepartments={false}
              />
            ))
          }
        </ul>
      </Container>
    </nav>
  )
}

CategoryMenu.schema = {
  title: 'Menu de categorias',
  description: 'Um menu mostrando uma lista de categorias disponíveis na loja',
  type: 'object',
  properties: {
    showAllDepartments: {
      type: 'boolean',
      title: "Mostrar a opção de 'Todos os Departamentos'",
      default: true
    },
    showCategories: {
      type: 'boolean',
      title: 'Mostrar categorias',
      default: true
    },
    // images: {
    //   title: 'Imagens',
    //   type: 'array',
    //   minItems: 0,
    //   items: {
    //     title: 'Imagens',
    //     type: 'object',
    //     properties: {
    //       imageDesktop: {
    //         type: 'string',
    //         default: '',
    //         title: 'Imagem - Desktop',
    //         widget: {
    //           'ui:widget': 'image-uploader'
    //         },
    //       },
    //       mobileImage: {
    //         type: 'string',
    //         default: '',
    //         title: 'Imagem - Mobile',
    //         widget: {
    //           'ui:widget': 'image-uploader'
    //         },
    //       },
    //       linkDesktop: {
    //         default: '',
    //         title: 'Link',
    //         $ref: 'Link'
    //       },
    //       descriptionDesktop: {
    //         type: 'string',
    //         default: '',
    //         title: 'Descrição'
    //       }
    //     }
    //   }
    // },
    departmentsSchema: {
      title: "Departamentos",
      type: 'array',
      minItems: 0,
      items: {
        title: 'Departamento',
        type: 'object',
        properties: {
          isDirectLink: {
            title: "É um link direto?",
            description: "",
            enum: [true, false],
            default: false,
            enumNames: [
              "Sim",
              "Não"
            ],
            widget: {
              "ui:widget": "radio"
            }
          }
        },
        dependencies: {
          isDirectLink: {
            oneOf: [
              {
                properties: {
                  isDirectLink: {
                    enum: [true]
                  },
                  __editorItemTitle: {
                    default: 'Link',
                    title: 'Identificador (Opcional)',
                    description: 'Apenas para o Site Editor',
                    type: 'string'
                  },
                  hasFeatured: {
                    title: 'Adicionar destaque?',
                    type: 'boolean',
                    default: false
                  },
                  name: {
                    title: 'Título',
                    type: 'string'
                  },
                  href: {
                    title: 'URL',
                    type: 'string'
                  },
                  openNewPage: {
                    title: "Abrir em uma nova aba?",
                    description: "",
                    enum: [true, false],
                    enumNames: [
                      "Sim",
                      "Não"
                    ],
                    default: false,
                    isLayout: false,
                    widget: {
                      "ui:widget": "radio"
                    }
                  }
                }
              },
              {
                properties: {
                  isDirectLink: {
                    enum: [false]
                  },
                  __editorItemTitle: {
                    default: 'Departamento',
                    title: 'Identificador (Opcional)',
                    description: 'Apenas para o Site Editor',
                    type: 'string'
                  },
                  id: {
                    title: 'Id do Departamento',
                    type: 'number'
                  },
                  showSubCategories: {
                    type: 'boolean',
                    title: 'Mostrar subcategorias',
                    default: true
                  }
                  // image: {
                  //   type: 'string',
                  //   title: 'Imagem',
                  //   default: '',
                  //   widget: {
                  //     'ui:widget': 'image-uploader'
                  //   }
                  // }
                }
              }
            ]
          }
        }
      }
    }
  }
}

export default CategoryMenu