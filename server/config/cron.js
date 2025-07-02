const {Op} = require("sequelize");
const {Comb, SourceFeed} = require("../models");
const {startXmlCacheCronJob} = require("../utils");

const crontab = {};

// Start jobs for all combs with interval
Comb.findAll({
  where: {
    cacheInterval: {[Op.not]: null}
  },
  include: SourceFeed
})
  .then(combs => {
    combs.forEach(comb => 
      startXmlCacheCronJob(comb, crontab)
    );
  });

module.exports = crontab;