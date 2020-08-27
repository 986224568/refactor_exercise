const test = require('ava');
const {statement} = require('../src/statement');
const {statementHtml} = require('../src/statement');


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};

test('statement case 1. Customer BigCo without performance. ', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n');
});

test('statement case 2. Customer BigCo has one performance hamlet and the audience is 30. ', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n' +
    ' Hamlet: $400.00 (30 seats)\n' +
    'Amount owed is $400.00\n' +
    'You earned 0 credits \n');
});

test('statement case 3. Customer BigCo has one performance hamlet and the audience is 31. ', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n' +
    ' Hamlet: $410.00 (31 seats)\n' +
    'Amount owed is $410.00\n' +
    'You earned 1 credits \n');
});

test('statement case 4. Customer BigCo has one performance As You Like It and the audience is 20. ', t => {
  const invoice = {
    'customer': 'BigCo2',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo2\n' +
    ' As You Like It: $360.00 (20 seats)\n' +
    'Amount owed is $360.00\n' +
    'You earned 4 credits \n');
});

test('statement case 5. Customer BigCo has one performance As You Like It and the audience is 21. ', t => {
  const invoice = {
    'customer': 'BigCo2',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 21,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo2\n' +
    ' As You Like It: $468.00 (21 seats)\n' +
    'Amount owed is $468.00\n' +
    'You earned 4 credits \n');
});

test('statement case 6. Customer BigCo has three performances. ' +
  'Hamlet has 55 audiences. ' +
  'As You Like Is has 35 audiences. ' +
  'Othello has 40 audiences. ', t => {

  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n' +
    ' Hamlet: $650.00 (55 seats)\n' +
    ' As You Like It: $580.00 (35 seats)\n' +
    ' Othello: $500.00 (40 seats)\n' +
    'Amount owed is $1,730.00\n' +
    'You earned 47 credits \n');
});

test('statement case 7. Customer BigCo has one unknown performance. ', t => {
  const plays = {
    'othello': {
      'name': 'Othello',
      'type': 'tragedy1',
    },
  };
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  try {
    statement(invoice, plays);
    t.fail();
  }
  catch (e) {
    t.is(e.message, 'unknown type: tragedy1');
  }
});


test('statement case 8. Customer BigCo has three performances. ' +
  'Hamlet has 55 audiences. ' +
  'As You Like Is has 35 audiences. ' +
  'Othello has 40 audiences. ', t => {

  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const result = statementHtml(invoice, plays);

  // t.is(result, 'Statement for BigCo\n' +
  //   ' Hamlet: $650.00 (55 seats)\n' +
  //   ' As You Like It: $580.00 (35 seats)\n' +
  //   ' Othello: $500.00 (40 seats)\n' +
  //   'Amount owed is $1,730.00\n' +
  //   'You earned 47 credits \n');

  t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
    ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
    ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,730.00</em></p>\n' +
    '<p>You earned <em>47</em> credits</p>\n');
});

// t.is(result, '<h1>Statement for BigCo</h1>\n' +
//     '<table>\n' +
//     '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
//     ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
//     ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
//     ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
//     '</table>\n' +
//     '<p>Amount owed is <em>$1,730.00</em></p>\n' +
//     '<p>You earned <em>47</em> credits</p>\n');

// t.is(result, 'Statement for BigCo2\n' +
// ' As You Like It: $360.00 (20 seats)\n' +
// 'Amount owed is $360.00\n' +
// 'You earned 4 credits \n');
