
import { expect } from 'chai';
import { add } from '../src/model'

describe('calculate', function() {
  it('add', function() {    
    expect(add(3,4)).equal(7);
  }); 
});