const User = require('../models/Users');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();


module.exports.renderLogin = (req, res) => {
    res.render('pages/login');
}

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '665999096135-8onhd9jfj6f6rj4qid16s9j6qnqumf55.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    if (payload['hd'] !== 'blindbrook.org') {
      throw new Error('Only Blind Brook emails are allowed to sign into this platform.');
    }
    return payload;
}

module.exports.authenticate = async (req, res) => {
    try {
      const { name, email, picture } = await verify(req.body.id_token);
      const { user } = await User.findByCredentials(name, email, picture.replace('s96-c', 's240-c'));
      const token = await user.generateAuthToken();
      res.cookie('token', `Bearer ${token}`, { httpOnly: true, sameSite: true, expires: new Date(new Date().getTime() + (1000*60*60*24*365*10)) });
      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      console.log(error);
      return res.send({ error: 'Only Blind Brook emails are allowed to sign into this platform.' });
    }
}