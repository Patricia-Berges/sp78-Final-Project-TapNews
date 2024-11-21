import React, {useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"; 
import "../../styles/card.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../store/AuthContext";



function CardNew() {
  const [description, setDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCommentNews, setCurrentCommentNews] = useState(null)
  const { store, actions } = useContext(Context);
  const { handleUserLogout } = useAuth();

  const visibility_description = () => {
    setDescription(!description); 
  };

  // useEffect(() => {
  //   handleUserLogout()
  // }, [])

  const userId = localStorage.getItem('user_id');
  const user_likes = store.likes;
  const user_favorites = store.favouriteNews.map(news => news.id)

 

  const likeStyle = (id) => {
    return user_likes.includes(id) ? {color: "#FF0000"} : {color: "#FFFFFF"};
  }

  const bookmarkStyle = (id) => {
    return user_favorites.includes(id) ? {color: "#FF0000"} : {color: "#FFFFFF"};
  }

  useEffect(() => {
    if(localStorage.getItem('user_id')) {
      actions.getUserLikes();
      actions.getFavouriteNews();  
    }
  }, [userId]);

  const handleLike = (id) => {
    if(!user_likes.includes(id)){
      actions.addLike(id);
    } else {
      actions.deleteLike(id);
    }
  }


  const handleBookmark = (id) => {
    if (!user_favorites.includes(id)) {
      actions.addFavouriteNew({ uuid: id });  
    } else {
      actions.deleteFavouriteNew(id); 
    }
  }

  // Abre el modal y establece la noticia seleccionada
  const handleCommentClick = (news) => {
    setCurrentCommentNews(news); // Guarda la noticia actual
    setShowModal(true); // Muestra el modal
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCommentNews(null);
  };

  return (
    <>
      {store.topnews.map((singleNew, index) => (
        <Card className="Card-bg" key={index} style={{backgroundImage: `url(${singleNew.image_url})`, width: '100%', height: '55rem', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
          <div className="actions d-flex flex-column" style={{backdropFilter: description ? 'brightness(30%)' : 'brightness(60%)'}}>
            <FontAwesomeIcon onClick={() => handleLike(singleNew.uuid)} size="2xl" icon={faHeart} style={likeStyle(singleNew.uuid)} className="like p-2" />
            <FontAwesomeIcon onClick={() => handleBookmark(singleNew.uuid)} size="2xl" icon={faBookmark} style={bookmarkStyle(singleNew.uuid)} className="save p-2" />
            <FontAwesomeIcon size="2xl" icon={faComment} style={{color: "#FFFFFF"}} className="comment p-2" onClick={() => handleCommentClick(singleNew)}/>
            <FontAwesomeIcon size="2xl" icon={faShare} style={{color: "#FFFFFF"}} className="share p-2" />
          </div>
          <Card.Body style={{backdropFilter: description ? 'brightness(40%)' : 'brightness(70%)', marginTop: description ? '150%' : '170%'}} className="mycardbody">
            <Card.Title className="title" onClick={visibility_description}>{singleNew.title}</Card.Title>
            <Card.Text className="description" style={{ visibility: description ? 'visible' : 'hidden' }}>
              {singleNew.description}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
      
      {/* modal para comentarios */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCommentNews ? (
            <div>
              <h5>{currentCommentNews.title}</h5>
              <p>{currentCommentNews.description}</p>
              <textarea
                className="form-control"
                placeholder="Escribe tu comentario..."
                rows="3"
              ></textarea>
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary">Enviar comentario</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CardNew;
