import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, 
   Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CnvModal from './CnvModal';
import { ConfDialog, CnvDetail } from '../index';
import { delCnv} from '../../api';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
      }
      this.openModal = this.openModal.bind(this);
      this.openConfirmation = this.openConfirmation.bind(this);
      this.render = this.render.bind(this);
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      const newState = { showModal: true };
      if (cnv)
         newState.editCnv= cnv;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editCnv) {
            this.modCnv(result, result.title);
         }
         else
            this.newCnv(result);
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(result, title) {
      this.props.modCnv(this.state.editCnv.id, title);
      this.props.updateCnvs();
   }

   newCnv(result) {
      this.props.addCnv({ title: result.title });
      this.props.updateCnvs();
   }

   openConfirmation = (cnv, cnvTitle) => {
      this.setState({ delCnv: cnv, 
         delCnvTitle: cnvTitle, showConfirmation: true })
      this.props.updateCnvs();
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   render() {
      var cnvItems = [];
      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               id = {cnv.id}
               title={cnv.title}
               lastMessage={cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(cnv, cnv.title)}
               onEdit={() => this.openModal(cnv)} />);
      });
      return (
         <section className="container">
            <h1>Cnv Overview</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Conversation
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editCnv ? "Edit title" 
                  : "New Conversation"}
               cnv={this.state.editCnv}
               onDismiss={this.modalDismiss} />


            <ConfDialog
               show={this.state.showConfirmation}
               title={"Delete Conversation"}
               body={`Are you sure you want to delete the Converstaion
                  '${this.state.delCnvTitle}'`}
               buttons={['Yes', 'Abort']}
               onClose={but => { 
                  if (but === 'Yes') {
                     console.log(this.props.history);
                     this.props.delCnv(this.state.delCnv.id);
                  }
                  this.setState({ showConfirmation: false });                  
               }}
            />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = (props) => {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
               <Link to={"/CnvDetail/" + props.id}>{props.title}</Link></Col>
            <Col sm={4}> {
               props.lastMessage ? 
               new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.lastMessage)) : "N/A" }
            </Col>
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" 
                     onClick={props.onDelete}>
                     <Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" 
                     onClick={props.onEdit}>
                     <Glyphicon glyph="edit" /></Button>
               </div>
               : ''}
         </Row>
      </ListGroupItem>
   )
}
