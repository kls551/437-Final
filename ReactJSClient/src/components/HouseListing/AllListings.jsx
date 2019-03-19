import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem} from 'react-bootstrap';
import { Col, Row, Button, Glyphicon, Image, 
   FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import ListingModal from './ListingModal';
import ConfDialog  from '../ConfDialog/ConfDialog';
import './AllListings.css';

export default class AllListings extends Component {
   constructor(props) {
      super(props);
      this.props.updateLsts();
      this.state = {
         showModal: false,
         showConfirmation: false,
         delLst: undefined,
         editLst: undefined,
      }
      this.openModal = this.openModal.bind(this);
      this.openConfirmation = this.openConfirmation.bind(this);
      this.openModal = this.openModal.bind(this);
      this.render = this.render.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handleOptionChange = this.handleOptionChange.bind(this);
      this.handleNumBeds = this.handleNumBeds.bind(this);
      this.handleNumBedsPost = this.handleNumBedsPost.bind(this);
   }

   openModal = (lst) => {
      let newState = { showModal: true };
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

   handleOptionChange = event => {
      this.setState({selected: event.target.value});
   }
   handleFormSubmit = event => {
      event.preventDefault();
      this.props.updateLsts(null, this.state.selected);
      console.log("CHANGE!", this.state.selected);
   }
   handleNumBeds = event => {
      this.setState({numBeds: event.target.value});
   }
   handleNumBedsPost = () => {
      this.props.updateLsts(null, null, this.state.numBeds);
   }

   modLst(result) {  
      this.props.modLst(this.state.editLst.id, result.listing, 
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
                     <form onSubmit={this.handleFormSubmit}>

                        <div className="form-check">
                        <label>
                           <input
                              type="radio"
                              name="react-tips"
                              value={-1}
                              checked={this.state.selected == -1}
                              onChange={this.handleOptionChange}
                              className="form-check-input"
                           />
                           price(high-low)
                        </label>
                        </div>

                        <div className="form-check">
                        <label>
                           <input
                              type="radio"
                              name="react-tips"
                              value={1}
                              checked={this.state.selected == 1}
                              onChange={this.handleOptionChange}
                              className="form-check-input"
                           />
                           price(low-high)
                        </label>
                        </div>
                        <div className="form-group">
                        <button className="btn btn-primary mt-2" 
                        type="submit">
                           Sort
                        </button>
                        </div>

                     </form>

                     <FormGroup>
                     <ControlLabel>Number of Beds</ControlLabel>
                     <Row>
                        <Col sm={7}>
                           <FormControl className="form-control-sm"
                              type="text"
                              value={this.state.numBeds}
                              placeholder="Enter a number"
                              onChange={this.handleNumBeds}
                           />
                        </Col>
                        <Col className="pull-right">
                           <button  onClick={this.handleNumBedsPost} 
                           type="submit" 
                           className="btn btn-primary mt-2">Filter</button>
                        </Col>
                     </Row>
                     </FormGroup>
                     </ListGroupItem>
                  </ListGroup>
               </Col>
               

               <Col sm={9}>
                  <Button className="btn btn-primary" 
                  onClick={() => this.openModal()}>
                     New Listing
                  </Button>               
                  <ListGroup>
                     {lstItems}
                  </ListGroup>
               </Col>
            </Row>
               
               {/* Modal for creating and change lst */}
               <ListingModal
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
      <ListGroupItem className="list-group-item-info">
         <Row>
            <Col sm={6}>
            <div>
            <h3>
               {console.log("id ", props.id)}
               {console.log("lst ", props)}
               <Link to={ { pathname: "/ListingDetail/" + props.id, 
                        state : {lstTitle : props.lst.title, 
                           lstId: props.lst.id, lst: props.lst} } }  
                        title={props.lst.title}> {props.lst.title} </Link> 
            </h3></div>
            <div>
                  <Image src={props.lst.imageUrl} thumbnail />
            </div>
            </Col>

            <Col sm={3}> 
               <h4>
                  { props.lst.postedDate ? 
                  new Intl.DateTimeFormat('en-US', 
                  {
                     year: 'numeric', month: 'short', day: 'numeric',
                  })
                  .format(new Date(props.lst.postedDate))
                  :
                  "N/A" }
               </h4> 
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

            <Col>
            <div>
            <Col sm={6}> </Col>
            <Col sm={6}> <h4> {`Price:   ${props.lst.price}`} </h4></Col>
         </div>

         <div> 
            <Col sm={6}> </Col>
            <Col sm={6} > <h4> {`Location:  ${props.lst.location}`} </h4>
            </Col>
         </div>

         <div>
            <Col sm={6}> </Col>
            <Col sm={6} >  <h4> {`Number of Bedroom: ${props.lst.numBed}`}  
            </h4> </Col>
         </div>

         <div>
            <Col sm={6}> </Col>
            <Col sm={6}  > 
            <h4>{`Contact Information:  ${props.lst.contactInfo}`} </h4> 
            </Col>
         </div>
            </Col>

         </Row> 
      </ListGroupItem>
   )
}
