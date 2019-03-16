import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem} from 'react-bootstrap';
import { Col, Row, Button, Glyphicon } from 'react-bootstrap';
import CnvModal from './CnvModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import ErrorDialog  from '../ErrorDialog/ErrorDialog';
import deleteCnv from '../../api';
import CnvDetail from './CnvDetail'
import './AllListings.css';

export default class AllListings extends Component {
   constructor(props) {
      super(props);
      this.props.updateLsts();
      this.state = {
         showModal: false,
         showConfirmation: false,
         delLst: undefined,
      }
      this.openModal = this.openModal.bind(this);
      this.openConfirmation = this.openConfirmation.bind(this);
      this.render = this.render.bind(this);
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      console.log("opening modal");
      const newState = { showModal: true };
      if (cnv)
         newState.editLst = cnv;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editLst) {
            this.modLst(result);
         }
         else {
            this.addLst(result);
         }
      }
      else if (result.status === "warning") {
         this.setState({showError : true});
      }
      this.setState({ showModal: false, editLst: null });
   }

   modLst(result) {  
      this.props.modLst(this.state.editLst.id, result.title, 
         () => this.props.history.push('/'), 
         () => this.setState({showError: true}));
   }

   addLst(result) {
      this.props.addLst(result.listing, 
          () => this.props.history.push('/'), 
          () => this.setState({showError: true}));
   }

   openConfirmation = (cnv, title) => {
      this.setState({ delLst: cnv, showConfirmation: true , title: title})
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   render() {
      var lstItems = [];
      var self = this;

      this.props.Listing.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            lstItems.push(<LstItem
               key={cnv.id}
               id={cnv.id}
               title = {cnv.title}
               // lastMessage = {cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => this.openModal(cnv)} />);
      });

      return (
         <section className="container">
            <h1>All Listings </h1>
            <ListGroup>
               {lstItems}
            </ListGroup>
            <Button className="btn btn-primary" onClick={() => this.openModal()}>
               New Listing
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editLst ? "Edit title" : "New Conversation"}
               lst={this.state.editLst}
               onDismiss={this.modalDismiss} />

            <ConfDialog
               showConfirmation={this.state.showConfirmation}
               title={"Detele Conversation"}
               body={`Would you like to delete 
               ${this.state.delLst ? this.state.delLst.title : ""}?`}
               buttons={['YES', 'NO']}
               onClose={answer => {
                  if (answer === 'YES') {
                     this.props.delLst(this.state.delLst.id,
                        () => this.props.history.push("/"));
                     this.setState({delLst: null, showConfirmation: false});   
                  }
                  else if (answer === 'NO') {
                     this.setState({delLst: null, showConfirmation: false});
                  }
               }}
            />
         </section>
      )
   }
}

// A Cnv list item
const LstItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
            <Link to={ { pathname: "/CnvDetail/" + props.id, 
                        state : {cnvTitle : props.title, cnvId: props.id} }}  
                        title={props.title}> {props.title} </Link> </Col>
            <Col sm={4}> { props.postedDate ? 
               new Intl.DateTimeFormat('en-US', 
               {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
               })
               .format(new Date(props.postedDate))
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
