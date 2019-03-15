import React, { PureComponent } from 'react';
import { Modal, Button, Alert} from 'react-bootstrap';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ErrorDialog extends PureComponent {
   constructor(props) {
      super(props);
      console.log("Constructing ErrorDialog w/ ", props);
   }
   close = (result) => {
      this.props.onClose(result);
   }

   render() {
      console.log("ErrorDialog rerenders");
      return (
         <Modal show={this.props.showError} onHide={() => this.close("Ok")}>
            <Modal.Header closeButton>
               <Modal.Title>{"Error Notice"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-danger" role="alert"> 
                {this.props.body} </div>
            </Modal.Body>
            <Modal.Footer>
               {this.props.buttons.map((btn, i) => <Button key={i}
               onClick={() => this.props.onClose(btn)}>{btn}</Button>)}
            </Modal.Footer>
         </Modal>
      )
   }
}