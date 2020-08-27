function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = initResult(invoice);
  const format = forMat();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    ({ thisAmount, volumeCredits, result, totalAmount } = getInfoFromPerformance(play, thisAmount, perf, volumeCredits, result, format, totalAmount));
  }
  result = addAmountCredits(result, format, totalAmount, volumeCredits);
  return result;
}

module.exports = {
  statement,
};


function initResult(invoice) {
  return `Statement for ${invoice.customer}\n`;
}

function addAmountCredits(result, format, totalAmount, volumeCredits) {
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function forMat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function getInfoFromPerformance(play, thisAmount, perf, volumeCredits, result, format, totalAmount) {
  thisAmount = getTimeOut(play, thisAmount, perf);
  // add volume credits
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  //print line for this order
  result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  totalAmount += thisAmount;
  return { thisAmount, volumeCredits, result, totalAmount };
}

function getTimeOut(play, thisAmount, perf) {
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

