const https = require('https');
const axios = require('axios');
const wso2Service = {
  async getAccessToken() {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const tokenUrl = 'https://sso-poc.quito.gob.ec:9443/oauth2/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', 'suscriber');
      params.append('password', '123456');
      return await axios
        .post(tokenUrl, params, {
          httpsAgent,
          auth: {
            username: 'HHL0rlchxRfFMDFIKcam5IAqtiga',
            password: 'zfPlMJP9047GoyVAd0ro5xAf7Eoa',
          },
        })
        .then((response) => {
          //console.log('response', response);
          return response.data;
        });
    } catch (error) {
      //console.log(error);
      return error;
    }
  },
};

module.exports = wso2Service;
