import React, { Component } from 'react';
import { ListGroup, ListGroupItem, 
   Col, Row, Button } from 'react-bootstrap';
import MsgModal from './MsgModal';
import CnvModal from './CnvModal';
import { ConfDialog,CnvOverview } from '../index';
import { delCnv} from '../../api';
import './CnvOverview.css';

export default class CnvDetail extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showModal: false,
      }
      this.handleChange = this.handleChange.bind(this);
      this.cnvId = this.props.location.pathname.split('/')[2];
      this.openModal = this.openModal.bind(this);
      this.render = this.render.bind(this);
      this.props.getCnv(this.cnvId);
      this.props.getMsgs(this.cnvId);
   }

   openModal = (msg) => {
      const newState = { showModal: true };
      if (msg)
         newState.newMsg= msg;
      this.setState(newState);
   }

   newMsg(result) {
      this.props.addMsg(this.cnvId, { content: result.content });
      this.props.getMsgs(this.cnvId);
   }

   modalDismiss = (result) => {
      console.log(result);
      if (result.status === "Ok") {
         this.newMsg(result);
      }
      this.setState({ showModal: false});
   }

   handleChange(event) {
      const newState = {}
      newState[event.target.name] = event.target.value;
      this.setState(newState);
   }

   render() {
      console.log("state is ",this.state);
      console.log("props is ", this.props);
      var msgItems = [];
      this.props.Msgs.forEach(msg => {
         msgItems.push(<MsgItem
            key={msg.id}
            id = {msg.id}
            prsId = {msg.prsId}
            email={msg.email}
            whenMade={msg.whenMade}
            content={msg.content} />);
      });
      return (
         <section className="container">
            <h1>{this.props.Cnv.title}</h1>
            <ListGroup>
               {msgItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Message
            </Button>



            <MsgModal
               showModal={this.state.showModal}
               onDismiss={this.modalDismiss} />


         </section>)
   }
}

// A Cnv list item
const MsgItem = (props) => {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
            {props.email}</Col>
            <Col sm={4}> {
               props.whenMade ? 
               new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.whenMade)) : "N/A" }
            </Col>
         </Row>
         <Row><Col sm={4}>{props.content}</Col></Row>
      </ListGroupItem>
   )
}