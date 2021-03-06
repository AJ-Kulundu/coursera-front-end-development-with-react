import { Component } from 'react';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import Contact from './ContactComponent';
import Dishdetails from './DishdetailComponent';
import About from './AboutComponent';
import {connect} from 'react-redux';
import {postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders,postFeedback} from '../redux/ActionCreators'
import {actions} from 'react-redux-form';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const mapStateToProps = state => {
  return{
    dishes:state.dishes,
    comments:state.comments,
    promotions:state.promotions,
    leaders:state.leaders
  }
}
const mapDispatchToProps = (dispatch) => ({
  fetchDishes: () => {dispatch (fetchDishes())},
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
  postFeedback: (values) => dispatch(postFeedback(values))
});

class Main extends Component {
     
  onDishSelect(dishId){
    this.setState({selectedDish:dishId});
}
  componentDidMount() {
  this.props.fetchDishes();
  this.props.fetchComments();
  this.props.fetchPromos();
  this.props.fetchLeaders();
}
   render(){

    const HomePage = () => {
      return (
        <Home 
        dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishErrMess={this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
        promoLoading={this.props.promotions.isLoading}
        promoErrMess={this.props.promotions.errMess}
        leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
        leaderLoading={this.props.leaders.isLoading}
        leaderErrMess ={this.props.leaders.errMess}/>
      )
    }

    const DishWithId = ({match}) => {
      return(
        <Dishdetails dish = {this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]} 
         isLoading={this.props.dishes.isLoading}
         errMess = {this.props.dishes.errMess}
         comments={this.props.comments.comments.filter( comment => comment.dishId === parseInt(match.params.dishId,10))} 
         postComment={this.props.postComment}
         commentErrMess = {this.props.comments.errMess}/>
      );
    }    
  return (
    <div>
      <Header />
      <TransitionGroup>
        <CSSTransition key = {this.props.location.key} classNames="page" timeout = {300}>
      <Switch>
        <Route  path= '/home' component = {HomePage}/>
        <Route  exact path = "/menu" component = {() => <Menu dishes = {this.props.dishes} />}/>
        <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/> } />
        <Route path = "/menu/:dishId" component={DishWithId} />
        <Route path= "/aboutus" component={() => <About leaders= {this.props.leaders.leaders}/> } />
      {/* <Dishdetails dish ={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />*/}
       <Redirect to = "/home" />
       </Switch>
       </CSSTransition>
       </TransitionGroup>
       <Footer />
    </div>
    
  );
}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));