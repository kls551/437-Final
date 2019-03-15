import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         msgContent: "",
      }
   }

   close = (result) => {
      console.log(result, this.state);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         content: this.state.msgContent
      });
   }

   handleChange = (e) => {
      this.setState({ msgContent: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ msgContent: "" })
      }
   }

   render() {
      console.log("INSIDE MSG MODAL RENDER")
      return (
         <Modal show={this.props.showModal} 
            onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>Enter New Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="form-group">
                  <textarea
                  className="form-control"
                  id="NewMsg"
                  rows="2"
                  placeholder="Enter New Message"
                  value={this.state.msgContent} 
                  onChange={this.handleChange}
                  />
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}