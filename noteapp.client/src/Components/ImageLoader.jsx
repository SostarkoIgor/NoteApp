// ImageUploader.jsx
import React, { useEffect, useState } from 'react';
import styles from '../Styles/ImageLoader.module.css'

function ImageLoader({updateFormImage, initialImg}) {
  const [imageBase64, setImageBase64] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [filename, setFilename] = useState("")

  useEffect(() => {
    console.log(initialImg)
    if (initialImg && initialImg.length>0) {
        setImageBase64("https://localhost:7107/"+initialImg)
        setFilename("")
    }
  }, [])
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    updateFormImage(e.target.files[0])
    setFilename(file.name)
    const reader = new FileReader()

    reader.onloadend = () => {
        setImageBase64(reader.result)
        setErrorMessage("")
    }
      

    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("File is too big")
        }
        else
            reader.readAsDataURL(file)
    }
  }

  const removeImg = () => {
    setImageBase64(null)
    setFilename("")
    setErrorMessage("")
    updateFormImage("noimg")
  }

  return (
    <>
    <div className={styles.imageuploader}>
      <label className={styles.upload}>Upload image
      <input
        className={styles.imageinput}
        id="file"
        name='file'
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      </label>
      {(imageBase64!=null) && <button className={styles.button} type="button" onClick={() => removeImg()}>Delete image</button>}
      <a className={styles.filename}>{filename}</a>
      {imageBase64 && (
        <div>
          {errorMessage=="" && imageBase64.length>0 &&
          <div className={styles.imagecontainer}>
            <img
              src={imageBase64}
              alt="Error with display"
              className={styles.imagepreview}
            />
          </div>
          }
        </div>
      )}
      
      {errorMessage.length > 0 && <div className={styles.errormessage}>{errorMessage}</div>}
          </div>
    </>
  );
}

export default ImageLoader
