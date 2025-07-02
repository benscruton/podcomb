const cron = require("node-cron");
const cacheCombXml = require("./cacheCombXml");

const startXmlCacheCronJob = (comb, crontab) => {
  // If user has no cron object, create it
  if(!crontab[comb.userId]){
    crontab[comb.userId] = {};
  }
  // If there is already a running job, destroy it
  if(crontab[comb.userId][comb.id]){
    crontab[comb.userId][comb.id].destroy();
  }

  const expression = `0 ${comb.cacheInterval === 1 ? "*" : `*/${comb.cacheInterval}`} * * *`;

  const job = cron.schedule(expression, () => {
    cacheCombXml(comb);
  });
  crontab[comb.userId][comb.id] = job;
};

module.exports = startXmlCacheCronJob;