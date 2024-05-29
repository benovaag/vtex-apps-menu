import React from 'react'

import { Link } from 'vtex.render-runtime'

import styles from '../categoryMenu.css'

const ItemImage = ({
  category,
  images
}) => {
  //Pega a imagem correspondente a cada departamento
  var imageCurrentObj = [];
  var imageCurrent = "";

  console.log("images", images)

  let categoryId = category?.id

  if( categoryId){
    imageCurrentObj = images?.filter( item => item?.id == categoryId )

    if( imageCurrentObj.length > 0 ){
      imageCurrent = imageCurrentObj[0]?.image;
    }
  }

  return (
    (imageCurrent !== "") &&
      <div className={styles.menu_image}>
        <Link className={styles.departamentImageLink}>
          <img src={imageCurrent} width="310" height="470" loading="lazy" className={styles.menu_image_img} />
        </Link>
      </div>
  )
}

export default ItemImage
