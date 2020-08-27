function statement (invoice, plays) {
  var { result, format, totalAmount, volumeCredits } = getData(invoice, plays);
  result = addAmountCredits(result, format, totalAmount, volumeCredits);
  return result;
}

function statementHtml (invoice, plays) {
  var { result, format, totalAmount, volumeCredits } = getDataHtml(invoice, plays);
  result = addAmountCreditsHtml(result, format, totalAmount, volumeCredits);
  return result;
}

// function renderHtml (customer, performances, totalAmount, volumeCredits) {
//   let result = `<h1>Statement for ${customer}</h1>\n`;
//   result += '<table>\n';
//   result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
//   for (let pref of performances) {
//     result += ` <tr><rd>${pref.play.name}</td><td>${pref.audience}</td>`;
//     result += `<td>${usd(pref.amount)}</td></tr>\n`;
//   }
//   result += '</table>\n';
//   result += `<p>Amount owed is <em>${usd(totalAmount)}</em></p>\n`;
//   result += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
//   return result;
// }

module.exports = {
  statement,
  statementHtml,
};

function getData(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = initResult(invoice);
  const format = forMat();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    ({ thisAmount, volumeCredits, result, totalAmount } = getInfoFromPerformance(play, thisAmount, perf, volumeCredits, result, format, totalAmount));
  }
  return { result, format, totalAmount, volumeCredits };
}

function getDataHtml(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = initResultHtml(invoice);
  const format = forMat();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    ({ thisAmount, volumeCredits, result, totalAmount } = getInfoFromPerformanceHtml(play, thisAmount, perf, volumeCredits, result, format, totalAmount));
  }
  return { result, format, totalAmount, volumeCredits };
}

function initResult(invoice) {
  return `Statement for ${invoice.customer}\n`;
}

function initResultHtml(invoice) {
  let result = `<h1>Statement for ${invoice.customer}</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  return result;
}

function addAmountCredits(result, format, totalAmount, volumeCredits) {
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function addAmountCreditsHtml(result, format, totalAmount, volumeCredits) {
  result += '</table>\n';
  result += `<p>Amount owed is <em>${format(totalAmount / 100)}</em></p>\n`;
  result += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
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

function getInfoFromPerformanceHtml(play, thisAmount, perf, volumeCredits, result, format, totalAmount) {
  thisAmount = getTimeOut(play, thisAmount, perf);
  // add volume credits
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  //print line for this order

  result += ` <tr><td>${play.name}</td><td>${perf.audience}</td>`;
  result += `<td>${format(thisAmount / 100)}</td></tr>\n`;

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

