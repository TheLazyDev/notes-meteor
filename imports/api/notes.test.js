import {Meteor} from 'meteor/meteor';
import expect from 'expect';
import {Notes} from './notes';


if(Meteor.isServer){
    describe('notes', function(){

        const noteOne = {
                _id:'testNoteId1',
                title: 'Note 1',
                body: "Demo text for note",
                updatedAt:0,
                userId:'testUser1'
            };
        
        const noteTwo = {
                _id:'testNoteId2',
                title: 'Note 2',
                body: "Demo text for note 2",
                updatedAt:0,
                userId:'testUser2'
            };


        beforeEach(function(){

            Notes.remove({});
            Notes.insert(noteOne);
            Notes.insert(noteTwo);
        })

        it('should insert new note', function(){

            const userId = 'testId';

            const _id = Meteor.server.method_handlers['notes.insert'].apply({userId});

            expect(Notes.findOne({_id,userId})).toExist();

        })

        it('should not insert note if not authenicated', function (){

            expect(()=>{
                Meteor.server.method_handlers['notes.insert']()
            }).toThrow();
        })

        it('should remove note', function(){
            Meteor.server.method_handlers['notes.remove'].apply({userId: noteOne.userId},[noteOne._id]);

            expect(Notes.findOne({_id:noteOne._id})).toNotExist();
        })

        it('should not remove note if unauthenticated', function(){
            expect(()=>{
              Meteor.server.method_handlers['notes.remove'].apply({},[noteOne._id])
            }).toThrow();
        })

        it('should not remove note if invalid _id', function(){
            expect(()=>{
                Meteor.server.method_handlers['notes.remove'].apply({userId:noteOne.userId});
            }).toThrow();
        })

        it('should update note', function (){

            const title = 'this is an updated title';

            Meteor.server.method_handlers['notes.update'].apply({userId: noteOne.userId},[
                noteOne._id,
                {title}
            ])


            const note = Notes.findOne(noteOne._id);

            expect(note.updatedAt).toBeGreaterThan(0);
            expect(note).toInclude({
                title,
                body: noteOne.body
            })


        })

        it('should throw error if extra updates', function(){

            expect(()=>{
            
                Meteor.server.method_handlers['notes.update'].apply({userId: noteOne.userId},[
                noteOne._id,
                {title: 'new title',name}
               
                ]);

            }).toThrow();
        })


        it('should not update note if user was not creator', function(){

           const title = 'this is an updated title';

            Meteor.server.method_handlers['notes.update'].apply({userId: 'UserId2'},[
                noteOne._id,
                {title}
            ])


            const note = Notes.findOne(noteOne._id);

            expect(note).toInclude(noteOne);
 
        })


        it('should not update note if unauthenticated', function(){
            expect(()=>{
              Meteor.server.method_handlers['notes.update'].apply({},[noteOne._id])
            }).toThrow();
        })

        it('should not update note if invalid _id', function(){
            expect(()=>{
                Meteor.server.method_handlers['notes.update'].apply({userId:noteOne.userId});
            }).toThrow();
        })


        it('should return a users notes', function(){

           const res = Meteor.server.publish_handlers.notes.apply({userId: noteOne.userId});
           const notes = res.fetch();

           expect(notes.length).toBe(1);
           expect(notes[0]).toEqual(noteOne);
        })

        it('should return no notes for user that has none', function(){

            const res = Meteor.server.publish_handlers.notes.apply({userId:'testId34'});
            const notes = res.fetch();

            expect(notes.length).toBe(0);

        })
    })
}