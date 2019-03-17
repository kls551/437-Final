import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem} from 'react-bootstrap';
import { Col, Row, Button, Glyphicon} from 'react-bootstrap';
import CnvModal from './CnvModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import ErrorDialog  from '../ErrorDialog/ErrorDialog';
import deleteCnv from '../../api';
import ListingDetail from './ListingDetail'
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
   openModal = (lst) => {
      console.log("opening modal");
      const newState = { showModal: true };
      if (lst)
         newState.editLst = lst;
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

   openConfirmation = (lst, title) => {
      this.setState({ delLst: lst, showConfirmation: true , title: title})
   }

   closeConfirmation = (res) => {
      this.state.showConfirmation = false;
   }

   changeValue(value) {
      console.log(value);
   }

   render() {
      var lstItems = [];
      var self = this;

      this.props.Listing.forEach(lst => {
         if (!this.props.userOnly || this.props.Prss.id === lst.ownerId)
            lstItems.push(<LstItem
               key={lst.id}
               id={lst.id}
               lst={lst}
               // title = {lst.title}
               // price = {lst.price}
               // postedDate = {lst.postedDate}
               showControls={lst.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(lst)}
               onEdit={() => this.openModal(lst)} />);
      });

      return (
         <section className="container">
            <h1> All Listings </h1>
            <Row>
               <Col sm={3}>
                  <ListGroup>
                     <ListGroupItem>
                        SORTING OPTION
                     </ListGroupItem>
                  </ListGroup>
               </Col>
               

               <Col sm={9}>
                  <ListGroup>
                     {lstItems}
                  </ListGroup>

                  <Button className="btn btn-primary" onClick={() => this.openModal()}>
                     New Listing
                  </Button>
               </Col>
            </Row>
               

               
               
            
               {/* Modal for creating and change lst */}
               <CnvModal
                  showModal={this.state.showModal}
                  title={this.state.editLst ? "Edit Listing" : "New Listing"}
                  lst={this.state.editLst}
                  onDismiss={this.modalDismiss} />

               <ConfDialog
                  showConfirmation={this.state.showConfirmation}
                  title={"Detele Listing"}
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
      <ListGroupItem >
         <Row>
            <Col sm={6}>
            <Link to={ { pathname: "/ListingDetail/" + props.id, 
                        state : {lstTitle : props.lst.title, lstId: props.id} }}  
                        title={props.lst.title}> {props.lst.title} </Link> </Col>
            <Col sm={3}> { props.lst.postedDate ? 
               new Intl.DateTimeFormat('en-US', 
               {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
               })
               .format(new Date(props.lst.postedDate))
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

         <Row> 
            <Col sm={6}>{`Price:   ${props.lst.price}`} </Col>
         </Row>

         <Row> 
         <Col sm={6}> {`Location:  ${props.lst.location}`} </Col>
         </Row>

         <Row> 
         <Col sm={6}> {`Number of Bedroom: ${props.lst.numBed}`} </Col>
         </Row>

         <Row> 
         <Col sm={6}> {`Contact Information:  ${props.lst.contactInfo}`} </Col>
         </Row>
      </ListGroupItem>
   )
}
