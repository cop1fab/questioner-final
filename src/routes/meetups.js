import express from 'express';
import Meetup from '../controllers/Meetup';
import Rsvps from '../controllers/Rsvp';

const router = express.Router();

router.post('/', Meetup.create);
router.get('/', Meetup.getAllMeetups);
router.get('/:meetupId', Meetup.getMeetup);


export default router;