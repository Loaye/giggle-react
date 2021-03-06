import React from 'react';
import {connect} from 'react-redux';
import superagent from 'superagent';
import * as util from '../../../lib/util.js';
import SingleInput from '../../lib/single-input-form';
import * as profileAct from '../../../action/profile-action.js';


class ProfileForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = !!this.props.profile ? this.props.profile :
    {
      bio: '',
      avatar: '',
      genre: [],
      type: 'band',
      city: '',
      state: '',
      location: '',
      error: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addGenre = this.addGenre.bind(this);
    this.useCityLocation = this.useCityLocation.bind(this);
  }

  onChange(e) {
    let {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }


  onSubmit(e) {
    e.preventDefault();
    let {history} = this.props;
    let {bio, city, state} = this.state;
    if(!city || !state || !bio) return this.setState({error: true});

    this.useCityLocation()
    .then(loc => {
      let newProfile = {...this.state};
      newProfile.location = loc;
      return this.props.profile?
      this.props.updateProfile(newProfile):
      this.props.createProfile(newProfile);

    })
    .then(() => history.replace('/'))
    .catch(error => {
      this.setState({error});
    })
  }

  addGenre(genre) {
    this.state.genre.push(genre.toLowerCase());
    this.setState(this.state);
  }

  useCityLocation() {
    if(this.state.city !== '') {

      let city = this.state.city.split(' ').join('+');
      let state = this.state.state;

      return new Promise((resolve, reject) => {
        superagent.get(`http://maps.google.com/maps/api/geocode/json?address=\+${city},+${state}`)
        .end((error, res) => {
          if(error) reject({error});
          let {lat, lng} = res.body.results[0].geometry.location;
          resolve([parseFloat(lat), parseFloat(lng)]);
        });
      });
    }
  }

  render() {
    let type = this.state.type;
    return(
      <form className={this.props.className} onSubmit={this.onSubmit}>
        <label>Type of Account:</label>
        <select name='type' onChange={this.onChange}>
          <option value='band'>Band</option>
          <option value='venue'>Venue</option>
        </select>
        <p>{this.state.genre.join(', ')}</p>
        <label>Genres of music:</label>
        <SingleInput
          name='singleGenre'
          onComplete={this.addGenre}
          placeholder='Enter a Genre'
          buttonText='Add Genre'
        />
        <label>City:</label>
        <input
          name='city'
          type='text'
          placeholder='Enter a city'
          value={this.state.city}
          onChange={this.onChange}
        />
        <label>State:</label>
        <input
          name='state'
          type='text'
          placeholder='Enter State'
          value={this.state.state}
          onChange={this.onChange}
        />
        <label>Bio:</label>
        <textarea
          type='text'
          name='bio'
          placeholder='Please enter a short description about yo self'
          value={this.state.bio}
          onChange={this.onChange}
        ></textarea>
        <button type='submit'>Create Profile</button>
      </form>
    )
  }
}

let mapStateToProps = state => ({
  prof: state.profile
});

let mapDispatchToProps = dispatch => ({
  createProfile: profile => dispatch(profileAct.postProfile(profile)),
  updateProfile: profile => dispatch(profileAct.putProfile(profile)),
  userQuery:(max, genre, limit=10) => dispatch(profileAct.userQuery(max, genre, limit))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
