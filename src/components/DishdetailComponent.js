import React, { Component } from 'react';
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Label
} from 'reactstrap';
import {Link} from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';
import '../index.css';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen : !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId,
            values.rating,
            values.name,
            values.message
            )
    }
    render() {
        return (
            <>
            <Button outline onClick={this.toggleModal}>
                <span className="fa fa-pencil fa-lg"></span>Submit Comment
            </Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <div className="col-12 col-md-12">
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <div className="form-group">
                            <Label for="rating">Rating</Label>
                            <Control.select model=".rating" name="rating"
                                className="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                            </div>
                            <div className="form-group">
                            <Label for="lastname">Your Name</Label>
                                <Control.text model=".name" id="name" name="name"
                                className="form-control"
                                placeholder="Your Name" 
                                validators = {{
                                    required, 
                                    minLength: minLength(3),
                                    maxLength: maxLength(15)
                                }}/>
                                <Errors className="text-danger"
                                model = ".name"
                                show="touched"
                                messages = {{
                                    required: 'Required',
                                    minLength: 'Should at least be three characters long',
                                    maxLength: 'Should be less than or equal to 15 characters'
                                }} />
                            </div>
                            <div className="form-group">
                                <Label for="feedback">Comment</Label>
                                <Control.textarea model=".message" id="message" name="message"
                                className="form-control"
                                rows="6" />
                            </div>
                            <div className="form-group">
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                            </div>
                        </LocalForm>
                    </div>
                </ModalBody>
            </Modal>
            </>
        );
    }
} 

function RenderComments({comments, postComment, dishId}) {
    const commentList = (
        comments.map((comment) => {
            return (
                <Fade in>
                <li key={comment.comment}>
                    <div>
                        {comment.comment}
                    </div>
                    <div>
                        -- {comment.author}, 
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                    </div>
                </li>
                </Fade>
            );
        })
    );
    return (
        commentList.length ?
        <div>
            <h4>Comments</h4>
            <ul className="list-unstyled">
                <Stagger in >
                    {commentList}
                </Stagger>
            </ul>
            <CommentForm dishId={dishId} postComment={postComment}/>
        </div>
        :
        <CommentForm />
    );
}

function RenderDish({dish}) {
    return (
        <FadeTransform in
        transformProps={{
            exitTransform: 'scale(0.5) translateY(-50%)'
        }}>
            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name}/>
                <CardBody>
                    <CardTitle> {dish.name} </CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>
        );
}

const Dishdetail = (props) => {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if(props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if(props.dish != null ) {
        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to='/menu'>Menu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                            {props.dish.name}
                    </BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} 
                            postComment = {props.postComment}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
            </div>
        );
    }
    else {
       return (<div></div>)
    }
}

export default Dishdetail;
