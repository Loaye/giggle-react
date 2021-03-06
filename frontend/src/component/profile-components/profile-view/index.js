
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import superagent from 'superagent';


class ProfileView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      error: null
    }

    this.requestBooking = this.requestBooking.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    if(this.props.profile) return this.setState({profile: this.props.profile});
    let {params} = this.props.match;
    superagent.get(`/api/profile/${params.userName}`)
    .end((err, res) => {
      if(error) return this.setState({error});
      this.setState({profile: res.body});
    })
  }
  requestBooking() {

  }

  sendMessage() {

  }
  render() {
    let {profile} = this.props
    return(
      <section id='profile-view'>
        <div id='profile-display'>
          <img src={profile.avatar} />
          <h4>{profile.userName}</h4>
          <p>{profile.bio}</p>
          <button onClick={this.requestBooking}>Request Booking</button>
          <button onClick={this.sendMessage}>Send Message</button>
          <p>{`Location: ${profile.city}, ${profile.state}`}</p>
          <p>{`Genres: ${profile.genre.join(', ')}`}</p>
          <ul>
            <Link to={`/profile/photos-${profile.userName}`}>
              <li>
                <img src='https://assets3.thrillist.com/v1/image/1531235/size/tmg-slideshow_l.jpg' />
              </li>
            </Link>
            <Link to={`/profile/videos-${profile.userName}`}>
              <li>
                <img src='' />
              </li>
            </Link>
            <Link to={`/profile/tracks-${profile.userName}`}>
              <li>
                <img src='' />
              </li>
            </Link>
          </ul>
        </div>
        <div id='my-bookings'>
          <ul>
          {//Bookigs will be mapped here :D
          }
          </ul>
        </div>
      </section>
    )
  }
}

let mapStateToProps = state => ({
  profile: state.profile
})

let mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
