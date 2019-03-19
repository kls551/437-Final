import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Spinner, 
   Images, FormGroup, FormControl, HelpBlock,
   Button, Glyphicon, Panel 
   ,Carousel, CarouselItem, Image} from 'react-bootstrap';
import ImgModal from './imgModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import axios from 'axios'; 
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
      // this.handleChange = this.handleChange.bind(this);
      // this.upload = this.upload.bind(this);
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

   // handleChange = (e) => {
   //    let newState = {};
   //    // const files = Array.from(e.target.files);
   //    // // const files = e.target.files;
   
   //    // const formData = new FormData();
   //    // formData.append(0, files[0]);
   //    this.setState({selectedImg : e.target.files[0]});
   //    var path = URL.createObjectURL(e.target.files[0]);
   //    console.log("path ", path);
   //    console.log("selected file ", this.state.selectedImg);
   //    console.log("target file ",  e.target.files[0]);
   // };

   // upload = () => {
   //    this.props.uploadImages(this.state.lst.id, this.state.imageUrl);
   // }

   render() {
      var imgArray = this.props.Imgs;
      var imgItems = [];

      // this.props.Imgs.forEach( img => {
      //    imgItems.push(<ImgItem
      //    key = {img.id}
      //    imageUrl={img.imageUrl}
      //    />);
      // });

   return (
      <section className="container">

      <h1> {this.state.lst && this.state.lst.title} </h1>
         {/* Carousel - Photos */}
         <Row>
            {/* <MyCarousel items={this.props.Imgs} /> */}
      
            <Carousel>
              
               {/* {imgItems} */}
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
                  <Carousel.Caption>
                        <h3>Second slide label</h3>
                  </Carousel.Caption>
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
     

      {/* <input type="file"  onChange={this.handleChange} />
      <Button bsStyle="primary" onClick={this.uploadFile}>
         Save Image
      </Button> */}
      <ImgModal
            showModal={this.state.showModal}
            onDismiss={this.modalDismiss} />
      </section>
   )
   }
}

// const ImgItem = function (props) {
//    console.log(props)
//     return (
//        <Carousel.Item>
//           {console.log("in image item ---- ", props.imageUrl)}
//           <img
//             className="d-block w-700 h-500"
//             src={props.imageUrl} 
//             alt="First slide"
//          />
//        </Carousel.Item>
//     );
//  }


 const Item = (item) => (
   <Carousel.Item>
     {/* <a className="thumbnail" href="javascript:void(0)"> */}
     {/* {console.log("image URL --------- ", item && item.imageUrl)} */}
          <img className="media-object"
             src={item.imageUrl}
            //  alt={alt}
          />
       {/* </a> */}
    </Carousel.Item>
 )
 
 const MyCarousel = ({ items }) => (
   // <div className="root">
     <Carousel controls={false}>
       {items ? items.map((item, i) =>
        <Item key={i} item={item} />) : ""}
     </Carousel>
   // </div>
 )