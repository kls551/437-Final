import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         content:  "",
      }
   
      this.handleChange = this.handleChange.bind(this);
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         content: this.state.content
      });
      this.setState({content: ""});
   }

   getValidationState = () => {
      if (this.state.content) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ content: e.target.value });
   }

   render() {
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{"Enter New Message"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.content.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationState={this.getValidationState()}
                  >
                     <FormControl
                        type="text"
                        value={this.state.content}
                        placeholder={"Enter message here"}
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     <HelpBlock>Content cannot be empty</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}