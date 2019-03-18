import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Spinner, Images, FormGroup, FormControl, HelpBlock,
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
           imageUrl: "",
            // showModal: false,
            // showConfirmation: false,
            // lst: this.props.location.state.cnvTitle,
            // lst: this.props.lst,
            // cnvId: this.props.location.state.cnvId,
        };
     
      //   this.openModal = this.openModal.bind(this);
        this.render = this.render.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.upload = this.upload.bind(this);
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

   handleChange = (e) => {
      let newState = {};
      // const files = Array.from(e.target.files);
      const files = e.target.files[0];
      const formData = new FormData;
      let reader = new FileReader();
     console.log(reader.readAsText(files));


      formData.append(0, files);
   }

   onChange = (e) => {
      this.setState({ imageUrl: e.target.value });
   }

   upload = () => {
      console.log("images (formData) ------- ", this.state.images);
      this.props.uploadImages(this.state.lst.id, this.state.imageUrl);
   }
   render() {
      var imgItems = [];


      this.props.Imgs.forEach( img => {
         console.log("adding image ------ ", img.imageUrl);
         imgItems.push(<ImgItem
         key = {img.id}
         imageUrl = {img.imageUrl}
         />);
      });

      return (
         <section className="container">

         <h1> {this.state.lst && this.state.lst.title} </h1>
   
         <Panel>
            {/* Carousel - Photos */}
            <Row>
               <Carousel>

                  <Carousel.Item> 
                  <img
                     className="d-block w-700 h-500"
                     src={(this.props.Imgs && this.props.Imgs[0]) ? this.props.Imgs[0].imageUrl : ""}
                     alt="First slide"
                  />
                  </Carousel.Item> 

                  <Carousel.Item> 
                  <img
                     className="d-block w-700 h-500"
                     src={(this.props.Imgs && this.props.Imgs[1]) ? this.props.Imgs[1].imageUrl : ""}
                     alt="First slide"
                  />
                  </Carousel.Item>

                  <Carousel.Item> 
                     <img
                        className="d-block w-700 h-500"
                        src={(this.props.Imgs && this.props.Imgs[2]) ? this.props.Imgs[2].imageUrl : ""}
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

         </Panel>

      
         {/* <FormGroup type='file' name='imageUrl' onChange={this.handleChange} /> </input> */}
   
            <FormGroup controlId="formBasicText"
            >
            <FormControl
               type="text"
               value={this.state.imageUrl}
               // placeholder={"Enter message here"}
               onChange={this.onChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Content cannot be empty</HelpBlock>
         </FormGroup>
         <Button onClick={this.upload}> Upload Image </Button>
         </section>
      )
   }
}

const ImgItem = function (props) {
   console.log(props)
    return (
       <Carousel.Item>
          {console.log("in image item ---- ", props.imageUrl)}
          <img
            className="d-block w-700 h-500"
            src={props.imageUrl}
            // alt="First slide"
         />
       </Carousel.Item>
    );
 }