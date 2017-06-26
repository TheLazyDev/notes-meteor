import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';


export const NoteListHeader = (props)=>{
      
      return (
            <div>
                <button onClick={()=>{


                    props.meteorCall('notes.insert',(err,res)=>{

                        if(res){
                            props.Session.set('selectedNoteId',res);
                        }

                    })
               
                }}> Create Note </button>
            </div>
      )
}


NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    Session: PropTypes.object.isRequired
}



export default createContainer(()=>{

    return {
        meteorCall: Meteor.call,
        Session
    }

}, NoteListHeader);