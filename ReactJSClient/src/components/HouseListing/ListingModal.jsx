import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel,
    FormGroup, HelpBlock, Row, Col, ListGroup, ListGroupItem
} from 'react-bootstrap';


export default class CnvModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         title: (this.props.lst && this.props.lst.title) || "",
         price: (this.props.lst && this.props.lst.price) ||  "",
         numBed: (this.props.lst && this.props.lst.numBed) || "",
         location: (this.props.lst && this.props.lst.location) || "",
         description: (this.props.lst &&  this.props.lst.description) || "",
         contactInfo: (this.props.lst && this.props.lst.contactInfo) || "",
         imageUrl: (this.props.lst && this.props.lst.imageUrl) || "",
      }
     
      this.handleChange = this.handleChange.bind(this);
      this.render = this.render.bind(this);
      this.close = this.close.bind(this);
   }

   close = (result) => {
      let {
         title,
         price,
         numBed,
         location,
         description,
         contactInfo,
      } = this.state;

      const listing = {
         title,
         price,
         numBed,
         location,
         description,
         contactInfo,
      }

      this.props.onDismiss && this.props.onDismiss({
         status: result,
         listing: listing,
         imageUrl: this.state.imageUrl,
      });
   }

   getValidationState = () => {
      if (this.state.title) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      let newState = {};
      this.setState({ [e.target.id]: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState(nextProps.lst);
         // this.setState({ title: 
         //    (nextProps.lst && nextProps.lst.title) || "" })
      }
   }

   render() {
      console.log("CnvModal rerenders");
   
      return (
         <Modal show={this.props.showModal} 
               onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
              
               <Modal.Title> Make New Post </Modal.Title>
                {/* <Button onClick={this.toggle}> </Button> */}
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.title.length ?
                     this.close("Ok") : this.close("warning")}>
                  <FormGroup 
                  >
                  {/* <FormGroup controlId="formBasicText" required
                   validationState={this.getValidationState()}
                  ></FormGroup> */}
                     <ControlLabel>Title</ControlLabel>
                     <FormControl
                        id="title"
                        type="text"
                        value={this.state.title}
                        placeholder={this.state.title}
                        onChange={this.handleChange}
                     />
                     <Row>
                        <Col sm={6}>
                           <ControlLabel>Price</ControlLabel>
                           <FormControl
                              id="price"
                              type="text"
                              value={this.state.price}
                              placeholder={this.state.price}
                              onChange={this.handleChange}
                           />
                        </Col>
                        <Col sm={6}>
                           <ControlLabel>Number of Bed-room </ControlLabel>
                           <FormControl
                              id="numBed"
                              type="text"
                              value={this.state.numBed}
                              placeholder={this.state.numBed}
                              onChange={this.handleChange}
                           />
                        </Col>
                     </Row>

                     <ControlLabel> Location </ControlLabel>
                     <FormControl
                        id="location"
                        type="text"
                        value={this.state.location}
                        placeholder={this.state.location}
                        onChange={this.handleChange}
                     />

                     <ControlLabel> Contact Information </ControlLabel>
                     <FormControl
                        id="contactInfo"
                        type="text"
                        value={this.state.contactInfo}
                        placeholder={this.state.contactInfo}
                        onChange={this.handleChange}
                     />

                     <ControlLabel> Description </ControlLabel>
                     <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        value={this.state.description}
                        placeholder={this.state.description}
                        onChange={this.handleChange}
                     />
              
                     <FormControl.Feedback />
                     <HelpBlock>Fields cannot be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button className="btn btn-success" 
               onClick={() => this.close("Ok")}>Ok</Button>
               <Button className="btn btn-secondary" 
               onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}