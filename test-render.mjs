
import { render } from '@react-email/render';
import React from 'react';

const Template = () => React.createElement('div', null, 'Hello World');

async function test() {
  try {
    const html = await render(React.createElement(Template));
    console.log('SUCCESS:', html);
  } catch (err) {
    console.error('FAILURE:', err);
  }
}

test();
