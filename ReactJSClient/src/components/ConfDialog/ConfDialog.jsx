import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ConfDialog extends PureComponent {
   constructor(props) {
      super(props);
      console.log("Constructing ConfDialog w/ ", props);
   }
   close = (result) => {
      this.props.onClose(result);
   }

   render() {
      console.log("ConfDialog rerenders");
      return (
         <Modal show={this.props.showConfirmation} 
         onHide={() => this.close("NO")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {this.props.body}
            </Modal.Body>
            <Modal.Footer>
               {this.props.buttons.map((btn, i) => <Button key={i}
               onClick={() => this.props.onClose(btn)}>{btn}</Button>)}
            </Modal.Footer>
         </Modal>
      )
   }
}
