/* eslint-disable react/jsx-pascal-case */
import React, {Component} from 'react';
import {BreadcrumbItem,Breadcrumb, Card, CardBody, CardImg, CardText, CardTitle, Modal, ModalHeader, ModalBody,Button, Label,Col, Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger } from 'react-animation-components'

const required = (val) => val && val.length;
const minLength =(len) => (val) => !(val) || (val.length>= len);
const maxLength = (len) => (val) => val && (val.length <= len);
 
class  CommentForm extends Component {
    constructor(props){
        super(props);
         
        this.state = {
            isModalOpen: false
        }
      
     this.toggleModal = this.toggleModal.bind(this);
     this.handleComment = this.handleComment.bind(this);
    }

    toggleModal(){
      this.setState({isModalOpen:!this.state.isModalOpen})
    }

    handleComment(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment); 
        alert(JSON.stringify(values))      
    }
   
    render() { 
        return ( 
            <div>
            <Button outline onClick={this.toggleModal}>
                  <span className = "fa fa-pencil fa-lg">Submit Comment</span>
            </Button>
            <Modal isOpen={this.state.isModalOpen} toggle = {this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(value)=>this.handleComment(value)}>
                    <Row className="form-group">
                                <Label htmlFor="rating" md={4}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control"
                                         >
                                         <option>1</option>
                                         <option>2</option>
                                         <option>3</option>
                                         <option>4</option>
                                         <option>5</option>
                                    </Control.select>
                                </Col>
                    </Row>
                    <Row className="form-group">
                                <Label htmlFor="author" md={4}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={4}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        className="form-control"
                                        validators={{
                                            required
                                        }}
                                        rows="6"
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".comment"
                                        show="touched"
                                        messages={{
                                            required:'Comment Required'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                            <Col >
                                <Button type="submit" color="primary" >Submit</Button>
                            </Col>
                            </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </div>
         );
    }
}
 


    function RenderDish({dish}){
        if(dish!=null)
         return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in 
                    transformProps={{
                     exitTransform: 'scale(0.5) translateY(-50%) '
                     }}>
                    <Card key={dish.id}>
                    <CardImg width="100%" src={baseUrl + dish.image} alt= {dish.name}/>
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
         );
        else
        return(
            <div></div>
        );
    }

    function RenderComments({comments,postComment,dishId}){
        if(comments!=null){

              const com = comments.map(co =>{
                  return(
                  <Fade in>
                  <React.Fragment>
                  <li>{co.comment}</li><br></br>
                  <li>--{co.author}, {new Intl.DateTimeFormat("en-US", {year: 'numeric', month:'short', day:'2-digit'}).format(new Date(Date.parse(co.date)))}</li><br></br>
                  </React.Fragment>
                  </Fade>
                  )
              });
          return(
              <ul className = "list-unstyled">
                  <Stagger in>
                  {com}
                  <CommentForm dishId ={dishId} postComment={postComment}/> 
                  </Stagger>
              </ul>
          );
        }
        else{
            return(<div></div>);
        }
    }
    
    const Dishdetail = (props)=>{
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if(props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            )
        }
        else if(props.dish != null){
        return(
         <div className="container">
             <div className="row">
                 <Breadcrumb>
                 <BreadcrumbItem><Link to = "/menu">Menu</Link></BreadcrumbItem>
                 <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                 </Breadcrumb>
                 <div className="col-12">
                     <h3>{props.dish.name}</h3>
                     <hr/>
                 </div>
             </div>
             <div className="row">
                <RenderDish dish={props.dish} />
            <div className="col-12 col-md-5 m-1">
              <h4>Comments</h4>
              <RenderComments comments = {props.comments}
               dishId = {props.dish.id}
               postComment= {props.postComment} />
            </div>
            </div>
         </div>
        );
    }
}



export default Dishdetail;