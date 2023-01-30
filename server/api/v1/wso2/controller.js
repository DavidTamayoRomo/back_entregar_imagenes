

const wso2Service = require('../../../utils/wso2');

exports.token = async (req, res, next) => {
  try {

    const wso2 = await wso2Service.getAccessToken();

    res.json({
      success: true,
      data: wso2
    });

  } catch (error) {
    next(new Error(error));
  }
}
