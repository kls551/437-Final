import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Spinner, Images, 
    Button, Glyphicon, Panel , Carousel , CarouselItem, Image} from 'react-bootstrap';
import MsgModal from './MsgModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import deleteCnv from '../../api';

// import './AllListings.css';

export default class ListingDetail extends Component {
    constructor(props) {
       super(props);
      //   console.log("title : ", this.props.lst && this.props.lst.title);
        this.state = {
           lst: this.props.location.state.lst,
           uploading: false, 
           images: [],
            // showModal: false,
            // showConfirmation: false,
            // lst: this.props.location.state.cnvTitle,
            // lst: this.props.lst,
            // cnvId: this.props.location.state.cnvId,
        };
     
      //   this.openModal = this.openModal.bind(this);
        this.render = this.render.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

   componentDidMount() {
      const newState = this.state;
      newState.lst = this.props.location.state.lst;
      this.setState(newState);
      this.props.getLstImgs(this.state.lst && this.state.lst.id);

   }

   componentWillReceiveProps = (nextProps) => {
      // if (nextProps.showModal) {
         // console.log(" before state ", this.props.location.state.lst);
         const newState = this.state;
         newState.lst = this.props.location.state.lst;
      
         this.setState(newState);
         console.log("listing in detail  ", this.state.lst);
   }

   handleChange = (e) => {
      let newState = {};
      const files = Array.from(e.target.files);
      
      this.setState({uploading: true});
      const formData = new FormData();

      files.forEach((file, i) => {
         formData.append(i, file)
      })
      this.setState({images : formData});
      console.log("listing id ------- ", this.state.lst.id);
      console.log(formData);
      // this.props.uploadImages(this.state.lst.id, formData);
   }

   upload = () => {
      console.log("images (formData) ------- ", this.state.images);
      this.props.uploadImages(this.state.lst.id, this.state.images);
   }
   render() {
      var imgItems = [];

      this.props.Imgs.forEach((img) => {
         console.log("adding image ------ ", img);
         imgItems.push(<ImgItem
         key = {img.id}
         url = {img.imageUrl}
         />);
      });

      return (
         <section className="container">

         <h1> {this.state.lst && this.state.lst.title} </h1>
   
         <Panel>
            {/* Carousel - Photos */}
            <Row>
               <Carousel>

                  {imgItems}

                  {/* <Carousel.Item> 
                  <img
                     className="d-block w-700 h-500"
                     src={(this.props.Imgs && this.props.Imgs[0]) ? this.props.Imgs[0].imageUrl : ""}
                     alt="First slide"
                  />
               
                  </Carousel.Item>  */}

                  {/* <Carousel.Item> 
                  <img
                     className="d-block w-700 h-500"
                     src="http://cdn.goodshomedesign.com/wp-content/uploads/2014/05/mini-apartment-design.jpg"
                     alt="First slide"
                  />
                  <Carousel.Caption>
                     <h3>First slide label</h3>
                  </Carousel.Caption>
                  </Carousel.Item> */}
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

         </Panel>

         <input type='file' id='imageUrl' onChange={this.handleChange} /> 
         <Button onClick={this.upload}> Upload Image </Button>
         </section>
      )
   }
}

const ImgItem = function (props) {
   console.log(props)
    return (
       <CarouselItem>
          {console.log("in image item ---- ", props.url)}
          <img
            className="d-block w-700 h-500"
            src={props.url}
            alt="First slide"
         />
       </CarouselItem>
    )
 }