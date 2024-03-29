import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row,
   Button, Glyphicon, Panel 
   ,Carousel, CarouselItem, Image} from 'react-bootstrap';
import ImgModal from './imgModal';
import './AllListings.css';

export default class ListingDetail extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lst: this.props.location.state.lst,
         uploading: false, 
         images: [],
      };
   
      this.modalDismiss = this.modalDismiss.bind(this);
      this.openModal = this.openModal.bind(this);
      this.render = this.render.bind(this);
   }

   openModal = (img) => {
      const newState = { showModal: true };
      if (img)
         newState.newImg= img;
      this.setState(newState);
   }

   newImg(result) {
      this.props.addImg(this.state.lst.id, result.Path);
   }

   modalDismiss = (result) => {
      console.log(result);
      if (result.status === "Ok") {
         this.newImg(result);
      }
      this.setState({ showModal: false});
      this.props.getLstImgs(this.state.lst && this.state.lst.id);
   }
   componentDidMount() {
      const newState = this.state;
      newState.lst = this.props.location.state.lst;
      this.setState(newState);
      this.props.getLstImgs(this.state.lst && this.state.lst.id);
   }

   componentWillReceiveProps = (nextProps) => {
      const newState = this.state;
      newState.lst = this.props.location.state.lst;
   
      this.setState(newState);
      console.log("listing in detail  ", this.state.lst);
   }

   render() {
   return (
      <section className="container">

      <h1> {this.state.lst && this.state.lst.title} </h1>
         {/* Carousel - Photos */}
         <Row>
            <Carousel>
               <Carousel.Item> 
               <img
                  className="d-block w-700 h-500"
                  src={(this.props.Imgs && this.props.Imgs[0]) ? 
                     this.props.Imgs[0].imageUrl : ""}
                  alt="First slide"
               />
               </Carousel.Item> 

               <Carousel.Item> 
               <img
                  className="d-block w-700 h-500"
                  src={(this.props.Imgs && this.props.Imgs[1]) ?
                      this.props.Imgs[1].imageUrl : ""}
                  alt="First slide"
               />
               </Carousel.Item>

               <Carousel.Item> 
                  <img
                     className="d-block w-700 h-500"
                     src={(this.props.Imgs && this.props.Imgs[2]) ? 
                        this.props.Imgs[2].imageUrl : ""}
                     alt="First slide"
                  />
               </Carousel.Item>
            </Carousel>
         </Row>

         <Row>
            <Col sm={6}>
               <h3> {this.state.lst.description}</h3>
            </Col>

            <Col sm={6}>
               <div> <h3> Price: {this.state.lst.price} </h3> </div>
               <div> <h3> Location: {this.state.lst.location} </h3> </div>
               <div> <h3> Number of Bed: {this.state.lst.numBed} </h3> </div>
               <div> <h3> Date posted: { this.state.lst.postedDate ? 
                  new Intl.DateTimeFormat('en-US', 
                  {
                     year: 'numeric', month: 'short', day: 'numeric',
                  })
                  .format(new Date(this.state.lst.postedDate))
                  :
                  "N/A" } </h3> </div>
            </Col>

         </Row>

      <div className={(this.state.lst.ownerId != this.props.Prss.id) ? 'hidden' : ''}>
       <Button bsStyle="primary" 
            onClick={() => this.openModal()}>
            Add Image
         </Button>
      </div>
     
      <ImgModal
            showModal={this.state.showModal}
            onDismiss={this.modalDismiss} />
      </section>
   )
   }
}
