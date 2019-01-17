import meetups from '../models/meetups';
import Validate from '../helpers/Validate';

class Meetup {
  /* Checking if the Meetup exixts */
  static checkMeetup(meetupId) {
    let checkMeetup = {};
    for (const key in meetups) {
      if (meetups[key].id === meetupId) {
        checkMeetup = meetups[key];
        checkMeetup.createdOn = new Date(checkMeetup.createdOn).toDateString();
        checkMeetup.happeningOn = new Date(checkMeetup.happeningOn).toDateString();
        break;
      }
    }

    return checkMeetup;
  }
  /* create */
  static create(req, res) {
    // Validate inputs
    let checkInputs = [];
    checkInputs.push(Validate.title(req.body.location, true));
    checkInputs.push(Validate.title(req.body.topic, true));

    for (let i = 0; i < checkInputs.length; i += 1) {
      if (checkInputs[i].isValid === false) {
        return res.status(400).json({
          status: 400,
          error: checkInputs[i].error,
        });
      }
    }
    const newMeetup = {
      id: Math.ceil(Math.random() * 100),
      createdOn: Date.now(),
      location: req.body.location,
      images: req.body.images,
      topic: req.body.topic,
      happeningOn: Date.parse(new Date(req.body.happeningOn)),
      tags: req.body.tags
    };

    meetups.push(newMeetup);

    const isCreated = Meetup.checkMeetup(newMeetup.id);

    if (Object.keys(isCreated).length > 0) {
      return res.status(201).json({
        status: 201,
        data: isCreated,
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'Meetup not created!',
    });
  }
  /* get all meetups */
  static getAllMeetups(req, res) {
    if (Object.keys(meetups).length > 0) {
      let allMeetups = [];
      meetups.forEach(meetup => {
        meetup.createdOn = new Date(meetup.createdOn).toDateString();
        meetup.happeningOn = new Date(meetup.happeningOn).toDateString();
        allMeetups.push(meetup);
      });
      return res.status(200).json({
        status: 200,
        data: allMeetups,
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'Meetups not found!',
    });
  }
  /* get by id */
  static getMeetup(req, res) {
    let meetup = {};

    for (let key in meetups) {
      if (meetups[key].id === parseInt(req.params.meetupId)) {
        meetup = meetups[key];
        meetup.createdOn = new Date(meetup.createdOn).toDateString();
        meetup.happeningOn = new Date(meetup.happeningOn).toDateString();
        break;
      }
    }

    if (Object.keys(meetup).length > 0) {
      return res.status(200).json({
        status: 200,
        data: meetup,
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'Meetup not found!',
    });
  }
  /* get upcoming meetups */
  static getUpcomingMeetups(req, res) {
    const upcomingMeetups = [];

    for (let key in meetups) {
      if (Date.now() < meetups[key].happeningOn) {
        meetups[key].createdOn = new Date(meetups[key].createdOn).toDateString();
        meetups[key].happeningOn = new Date(meetups[key].happeningOn).toDateString();
        upcomingMeetups.push(meetups[key]);
      }
    }

    if (Object.keys(upcomingMeetups).length > 0) {
      return res.status(200).json({
        status: 200,
        data: upcomingMeetups,
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'No upcoming meetups!',
    });
  }
  /* delete a meetup */
  static deleteMeetup(req, res) {
    const meetupsNumber = meetups.length;
    let NewMeetupsNumber = meetups.length;
    for (let i in meetups) {
      if (meetups[i].id === parseInt(req.params.meetupId)) {
        meetups.splice(i, 1);
        NewMeetupsNumber -= 1;
        break;
      }
    }

    if (NewMeetupsNumber < meetupsNumber) {
      return res.status(200).json({
        status: 200,
        data: 'meetup deleted',
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'Meetup not deleted!',
    });
  }
}

export default Meetup;