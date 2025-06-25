const getHost = (req, rsp) => {
  rsp.json({
    hostUrl: process.env.HOST_URL || "http://localhost:8000"
  });
};

module.exports = {
  getHost
};