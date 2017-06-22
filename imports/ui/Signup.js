import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';



import {Accounts} from 'meteor/accounts-base';




export  class Signup extends React.Component {
    
    constructor(props){
       super(props);
  
       this.state = {
           error: ''
       }
    }
    

    onSubmit(e){
        e.preventDefault();
       
         let email = this.refs.email.value.trim();
         let password = this.refs.password.value.trim();

       if(password.length < 8) {
           return this.setState({error: 'Password must be more than 8 characters long'})
       }

       this.props.createUser({
           email,
           password
       },(err)=>{
           if(err){
               this.setState({
                   error: err.reason
               })
           } else {
                 this.setState({
                     error:''
                 })
           }

       })

        // this.setState({
        //     error: "Something went wrong "
        // })

    }

    render(){
    return (
        <div className='boxed-view'>
            <div className='boxed-view__box'>
            <h1>Join</h1>
            {this.state.error ? <p>{this.state.error}</p> : undefined}
            <form className='boxed-view__form' noValidate onSubmit={this.onSubmit.bind(this)}>
                <input ref='email'type='email' name='email' placeholder='Email'/>
                <input ref='password' type='password' name='password' placeholder='Password'/>
                <button className='button'> Create account </button>
            </form>
                
            <Link to='/'> Have an account? </Link>
            </div>
            
        </div>
    )
  }
}


Signup.propTypes = {
    createUser: PropTypes.func.isRequired
}







export default createContainer(()=>{

    return {
        createUser: Accounts.createUser
    }

}, Signup);