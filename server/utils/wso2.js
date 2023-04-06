const https = require('https');
const axios = require('axios');
require('dotenv').config();
const wso2Service = {
  async getAccessToken() {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const tokenUrl = `${process.env.FILE_SERVER}/oauth2/token`;
      const params = new URLSearchParams();
      params.append('grant_type', `${process.env.WSO2_GRANT_TYPE}`);
      params.append('username', `${process.env.WSO2_USER}`);
      params.append('password', `${process.env.WSO2_PASS}`);
      return await axios
        .post(tokenUrl, params, {
          httpsAgent,
          auth: {
            username: `${process.env.WSO2_CLIENT_ID}`,
            password: `${process.env.WSO2_CLIENT_SECRET}`,
          },
        })
        .then((response) => {
          //console.log('Token', response);
          return response.data;
        });
    } catch (error) {
      //console.log(error);
      return error;
    }
  },
};

module.exports = wso2Service;
