/* eslint-disable react/jsx-pascal-case */
import React, {Component} from 'react';
import {BreadcrumbItem,Breadcrumb, Card, CardBody, CardImg, CardText, CardTitle, Modal, ModalHeader, ModalBody,Button, Label,Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Loading} from './LoadingComponent';

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
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);       
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
                       <div className="form-group">
                           <Label htmlFor="rating" md={12}>Rating</Label>
                           <Col md={11}>
                               <Control.select model=".rating"
                               name="rating"
                               className= "form_control"
                               defaultValue = "1">
                                   <option>1</option>
                                   <option>2</option>
                                   <option>3</option>
                                   <option>4</option>
                                   <option>5</option>
                               </Control.select>
                           </Col>
                       </div>
                       <div className="form-group">
                           <Label htmlFor="author" md={12}>Your Name</Label>
                           <Col md={11}>
                               <Control.text model=".author"
                               name="author"
                               placeholder="Your Name"
                               className="form-control"
                               validators= {{
                                   required, 
                                   minLength:minLength(3),
                                   maxLength:maxLength(15)
                               }}
                                />
                               <Errors 
                               className="text-danger"
                               model=".author"
                               show="touched"
                               messages = {{
                                   required:'Required ',
                                   minLength:'Must be greater than 2 characters',
                                   maxLength:'Must be 15 characters or less' 
                               }}/>
                           </Col>
                       </div>
                       <div className="form-group">
                           <Label htmlFor="comment"md={12}>Comment</Label>
                           <Col md={11}>
                               <Control.textarea model=".comment"
                               name="comment"
                               className="form-control" 
                               rows= "6"/>
                           </Col>
                       </div>
                       <div className="form-group">
                           <Col md={{size:10, offset:2}}>
                               <Button type="submit" color="primary">Submit</Button>
                           </Col>
                       </div>
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
                <Card key={dish.id}>
                    <CardImg width="100%" src={dish.image} alt= {dish.name}/>
                     <CardBody>
                         <CardTitle>{dish.name}</CardTitle>
                         <CardText>{dish.description}</CardText>
                     </CardBody>
                </Card>
            </div>
         );
        else
        return(
            <div></div>
        );
    }

    function RenderComments({comments,addComment,dishId}){
        if(comments!=null){

              const com = comments.map(co =>{
                  return(
                  <React.Fragment>
                  <li>{co.comment}</li><br></br>
                  <li>--{co.author}, {new Intl.DateTimeFormat("en-US", {year: 'numeric', month:'short', day:'2-digit'}).format(new Date(Date.parse(co.date)))}</li><br></br>
                  </React.Fragment>
                  )
              });
          return(
              <ul className = "list-unstyled">
                  {com}
                  <CommentForm dishId ={dishId} addComment={addComment}/> 
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
               addComment= {props.addComment} />
            </div>
            </div>
         </div>
        );
    }
}



export default Dishdetail;