import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class imgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         imgPath: "",
      }
   }

   close = (result) => {
      console.log(result, this.state);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         Path: this.state.imgPath
      });
   }

   handleChange = (e) => {
      this.setState({ imgPath: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ imgPath: "" })
      }
   }

   render() {
      console.log("INSIDE img MODAL RENDER")
      return (
         <Modal show={this.props.showModal} 
            onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>Enter Image Path</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="form-group">
                  {/* <textarea
                  className="form-control"
                  id="Newimg"
                  rows="1"
                  placeholder="Enter Image Path"
                  value={this.state.imgPath} 
                  onChange={this.handleChange}
                  /> */}
                  <FormControl
                     id="Newimg"
                     type="text"
                     value={this.state.imgPath}
                     placeholder="Enter Image Path"
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