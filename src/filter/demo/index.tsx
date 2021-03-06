import React from 'react';
import { Filter } from 'motif-gi';

const domain = [1, 10];
const data = JSON.parse(
  '[{"count":2,"x0":2,"x1":2.2},{"count":0,"x0":2.2,"x1":2.4},{"count":0,"x0":2.4,"x1":2.6},{"count":0,"x0":2.6,"x1":2.8},{"count":0,"x0":2.8,"x1":3},{"count":3,"x0":3,"x1":3.2},{"count":0,"x0":3.2,"x1":3.4},{"count":0,"x0":3.4,"x1":3.6},{"count":0,"x0":3.6,"x1":3.8},{"count":0,"x0":3.8,"x1":4},{"count":1,"x0":4,"x1":4.2},{"count":0,"x0":4.2,"x1":4.4},{"count":0,"x0":4.4,"x1":4.6},{"count":0,"x0":4.6,"x1":4.8},{"count":0,"x0":4.8,"x1":5},{"count":4,"x0":5,"x1":5.2},{"count":0,"x0":5.2,"x1":5.4},{"count":0,"x0":5.4,"x1":5.6},{"count":0,"x0":5.6,"x1":5.8},{"count":0,"x0":5.8,"x1":6},{"count":0,"x0":6,"x1":6.2},{"count":0,"x0":6.2,"x1":6.4},{"count":0,"x0":6.4,"x1":6.6},{"count":0,"x0":6.6,"x1":6.8},{"count":0,"x0":6.8,"x1":7},{"count":1,"x0":7,"x1":7.2},{"count":0,"x0":7.2,"x1":7.4},{"count":0,"x0":7.4,"x1":7.6},{"count":0,"x0":7.6,"x1":7.8},{"count":0,"x0":7.8,"x1":8},{"count":2,"x0":8,"x1":8.2},{"count":0,"x0":8.2,"x1":8.4},{"count":0,"x0":8.4,"x1":8.6},{"count":0,"x0":8.6,"x1":8.8},{"count":0,"x0":8.8,"x1":9},{"count":2,"x0":9,"x1":9.2},{"count":0,"x0":9.2,"x1":9.4},{"count":0,"x0":9.4,"x1":9.6},{"count":0,"x0":9.6,"x1":9.8},{"count":0,"x0":9.8,"x1":10},{"count":3,"x0":10,"x1":10}]',
);
const dataType = 'INT';
const step = 0.1;
const format = '';
const value = [1.2, 9.8];

const onChangeRange = (arr: any) => {
  console.log(arr);
};

export default () => (
  <Filter
    histogram={{ domain, data, dataType, step, format }}
    value={value}
    onChange={onChangeRange}
  />
);
