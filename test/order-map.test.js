/*
 * Copyright 2025, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { expect } = require('chai');
const orderList = require('../utils/order-map');

describe('order-maps', () => {
  it('orders unordered keys', () => {
    const obj = { b: 'b', c: 'c', a: 'a' };
    const expected = '{"a":"a","b":"b","c":"c"}';

    expect(JSON.stringify(orderList(obj))).to.equal(expected);
  });
});
