import { Meteor } from  'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import ReactDOM from 'react-dom';
import {Session} from 'meteor/session';
import {browserHistory} from 'react-router';
import '../imports/startup/simple-schema-configuration.js';

import {routes, onAuthChange} from '../imports/routes/routes';


Tracker.autorun(()=>{
  
   const isAuthenticated = !!Meteor.userId();

   const currentPagePrivacy = Session.get('currentPagePrivacy');

  
   onAuthChange(isAuthenticated,currentPagePrivacy);


})


Tracker.autorun(()=>{
      const selectedNoteId = Session.get('selectedNoteId');

      if(selectedNoteId){
             browserHistory.replace(`/dashboard/${selectedNoteId}`)
      }
})


Meteor.startup(()=>{
  Session.set('selectedNoteId', undefined);
  ReactDOM.render(routes,document.getElementById('app'));
})