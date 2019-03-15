import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem} from 'react-bootstrap';
import { Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CnvModal from './CnvModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import ErrorDialog  from '../ErrorDialog/ErrorDialog';
import deleteCnv from '../../api';
import CnvDetail from './CnvDetail'
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
         delCnv: undefined,
      }
      this.openModal = this.openModal.bind(this);
      this.openConfirmation = this.openConfirmation.bind(this);
      this.render = this.render.bind(this);
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      const newState = { showModal: true };
      if (cnv)
         newState.editCnv = cnv;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editCnv) {
            this.modCnv(result);
         }
         else {
            this.newCnv(result);
         }
      }
      else if (result.status === "warning") {
         this.setState({showError : true});
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(result) {  
      this.props.modCnv(this.state.editCnv.id, result.title, 
         () => this.props.history.push('/'), 
         () => this.setState({showError: true}));
   }

   newCnv(result) {
      this.props.addCnv({ title: result.title }, 
          () => this.props.history.push('/'), 
          () => this.setState({showError: true}));
   }

   openConfirmation = (cnv, title) => {
      this.setState({ delCnv: cnv, showConfirmation: true , title: title})
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   render() {
      var cnvItems = [];
      var self = this;

      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               id={cnv.id}
               title = {cnv.title}
               lastMessage = {cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(cnv)}
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
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.editCnv}
               onDismiss={this.modalDismiss} />

            <ConfDialog
               showConfirmation={this.state.showConfirmation}
               title={"Detele Conversation"}
               body={`Would you like to delete 
               ${this.state.delCnv ? this.state.delCnv.title : ""}?`}
               buttons={['YES', 'NO']}
               onClose={answer => {
                  if (answer === 'YES') {
                     this.props.delCnv(this.state.delCnv.id,
                        () => this.props.history.push("/"));
                     this.setState({delCnv: null, showConfirmation: false});   
                  }
                  else if (answer === 'NO') {
                     this.setState({delCnv: null, showConfirmation: false});
                  }
               }}
            />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
            <Link to={ { pathname: "/CnvDetail/" + props.id, 
                        state : {cnvTitle : props.title, cnvId: props.id} }}  
                        title={props.title}> {props.title} </Link> </Col>
            <Col sm={4}> { props.lastMessage ? 
               new Intl.DateTimeFormat('en-US', 
               {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
               })
               .format(new Date(props.lastMessage))
               :
               "N/A" }</Col>
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
