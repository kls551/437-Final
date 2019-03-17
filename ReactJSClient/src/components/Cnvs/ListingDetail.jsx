import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } from 'react-bootstrap';
import MsgModal from './MsgModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import deleteCnv from '../../api';
// import './AllListings.css';

export default class ListingDetail extends Component {
    constructor(props) {
       super(props);
        console.log("title : ", this.props.lst && this.props.lst.title);
        this.state = {
            showModal: false,
            showConfirmation: false,
            // lst: this.props.location.state.cnvTitle,
            // lst: this.props.lst,
            // cnvId: this.props.location.state.cnvId,
        };
      //   this.props.updateMsgs(this.state.cnvId);
      //   this.openModal = this.openModal.bind(this);
        this.render = this.render.bind(this);
    }

   componentDidMount() {
      this.props.getLst(this.state.lst && this.state.lst.id);
   }

   componentWillReceiveProps = (nextProps) => {
      // if (nextProps.showModal) {
         const newState = this.state;
         newState.lst = nextProps.lst;
      
         this.setState(newState);
         console.log("listing in detail  ", this.state.lst);
         // this.setState({ title: 
         //    (nextProps.lst && nextProps.lst.title) || "" })
      // }
   }
   //  openModal = () => {
   //      const newState = { showModal: true };
   //      this.setState(newState);
   //  }

   //  modalDismiss = (result) => {    
   //       if (result.status === "Ok") 
   //          this.newMsg(result);
   //       this.setState({showModal: false});
   //  }
    
   //  newMsg(result) {
   //      this.props.addMsg(this.state.cnvId, 
   //          {content : result.content}, 
   //          () =>  this.props.history.push('/CnvDetail/' + this.state.cnvId));
   //  }

    render() {
        var msgItems = [];

      //    this.props.Msgs.forEach(msg => {
      //       msgItems.push(<MsgItem
      //          key={msg.id}
      //          onwerEmail = {msg.email}
      //          whenMade = {msg.whenMade}
      //          content = {msg.content}
      //          />);
      //   });
        
        return (
           <section className="container">

              <h1> {this.state.lst && this.state.lst.title} </h1>
              <h1> DETAIL OF LISTING </h1>
              <ListGroup>
                 {/* {msgItems} */}

              </ListGroup>
              {/* <Button bsStyle="primary" onClick={() => this.openModal()}>
                 New Message
              </Button> */}
              {/* Modal for creating and change cnv */}
              {/* <MsgModal
                 showModal={this.state.showModal}
                 title={"New Message"}
                 msg={this.state.msg}
                 onDismiss={this.modalDismiss} /> */}
           </section>
        )
     }
}

// const MsgItem = function (props) {
//     return (
//        <ListGroupItem>
//           <Row>
//              <Col sm={4}> {props.onwerEmail} </Col>
//              <Col sm={4}> { 
//                 new Intl.DateTimeFormat('en-US', 
//                 {
//                    year: 'numeric', month: 'short', day: 'numeric',
//                    hour: '2-digit', minute: '2-digit', second: '2-digit'
//                 })
//                 .format(new Date(props.whenMade)) } 
//                 </Col>
//              {props.showControls ?
//                 <div className="pull-right">
//                    <Button bsSize="small" 
//                            onClick={props.onDelete}>
//                            <Glyphicon glyph="trash" /></Button>
//                    <Button bsSize="small" 
//                            onClick={props.onEdit}>
//                            <Glyphicon glyph="edit" /></Button>
//                 </div>
//                 : ''}
//           </Row>
//           <Row> <Col sm={8}> {props.content}  </Col></Row> 
//        </ListGroupItem>
//     )
//  }