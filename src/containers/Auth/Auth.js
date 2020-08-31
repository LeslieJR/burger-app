import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import  Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {updateObject, checkValidity} from '../../shared/utility';
//import Spinner from '../../components/UI/Spinner/Spinner';
class Auth extends Component {
    constructor(){
        super();
        this.state={
            isSignup: true,
            controls:{
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'email'
                    },
                    value:'',
                    validation:{
                        required: true,
                        isEmail: true
                    },
                    valid:false,
                    touched: false
                },
            password: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'password'
                    },
                    value:'',
                    validation:{
                        required: true,
                        minLength: 6
                    },
                    valid:false,
                    touched: false
                }
        }
    }
}
    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== "/"){
            this.props.onSetAuthRedirectPath()
        }
    }
    
    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });
        
          this.setState({controls: updatedControls})
    } 

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup}
        })
    }

    
    render() {
        const formElementsArr = [];
        for (let key in this.state.controls) {
            formElementsArr.push({ 
                id: key,
                config: this.state.controls[key], 
            });
        }

        let form = formElementsArr.map(formEl => (
        <Input 
        key={formEl.id}
        elementType={formEl.config.elementType}
        elementConfig={formEl.config.elementConfig}
        value={formEl.config.value}
        invalid={!formEl.config.valid}
        shouldValidate={formEl.config.validation}
        touched={formEl.config.touched}
        changed={(event) => this.inputChangedHandler(event, formEl.id)}
        />
        
    ));
    let authRedirect = null;
    if(this.props.isAuthenticated){
        authRedirect = <Redirect to={this.props.authRedirectPath} />
    }
        return(
            <div className={classes.Auth}>
                {authRedirect}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button 
                    btnType="Success"
                    >SUBMIT</Button>
                </form>
                <Button 
                clicked={this.switchAuthModeHandler}
                btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loading:state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);