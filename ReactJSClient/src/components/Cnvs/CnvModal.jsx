import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'bootstrap-4-react';



export default class CnvModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lstTitle: (this.props.lst && this.props.lst.title) || "",
         price: "",
         numBed: "",
         loc: "",
         description: "",
         contactInfo: "",
      }
     
      this.handleChange = this.handleChange.bind(this);
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.lstTitle
      });
   }

   getValidationState = () => {
      if (this.state.lstTitle) {
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
         this.setState({ lstTitle: 
            (nextProps.lst && nextProps.lst.title) || "" })
      }
   }

   render() {
      console.log("CnvModal rerenders");
      console.log("show modal ", this.props && this.props.showModal);
      return (
         <Modal show={this.props.showModal} 
               onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
              
               <Modal.Title> Make New Post </Modal.Title>
                {/* <Button onClick={this.toggle}> </Button> */}
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.lstTitle.length ?
                     this.close("Ok") : this.close("warning")}>
                  <FormGroup controlId="formBasicText" required
                   validationState={this.getValidationState()}
                  >
                     <ControlLabel>Title</ControlLabel>
                     <FormControl
                        id="lstTitle"
                        type="text"
                        value={this.state.lstTitle}
                        placeholder={this.state.lstTitle}
                        onChange={this.handleChange}
                     />

                     <ControlLabel>Price</ControlLabel>
                     <FormControl
                        id="price"
                        type="text"
                        value={this.state.price}
                        placeholder={this.state.price}
                        onChange={this.handleChange}
                     />

                     <ControlLabel>Number of Bed-room </ControlLabel>
                     <FormControl
                        id="numBed"
                        type="text"
                        value={this.state.numBed}
                        placeholder={this.state.numBed}
                        onChange={this.handleChange}
                     />


                     <ControlLabel> Location </ControlLabel>
                     <FormControl
                        id="loc"
                        type="text"
                        value={this.state.loc}
                        placeholder={this.state.loc}
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
                     <FormControl
                        id="description"
                        type="text"
                        value={this.state.description}
                        placeholder={this.state.description}
                        onChange={this.handleChange}
                     />
              
                     <FormControl.Feedback />
                     <HelpBlock>Title can not be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button className="btn btn-success" onClick={() => this.close("Ok")}>Ok</Button>
               <Button className="btn btn-secondary" onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}