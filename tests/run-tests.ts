import assert from 'node:assert/strict';
import {
  countSchema,
  transactionHashSchema,
  walletAddressSchema,
} from '../libs/server/validation.ts';

function test(name: string, callback: () => void) {
  try {
    callback();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('walletAddressSchema accepts 0x-prefixed 40-byte addresses', () => {
  const address = `0x${'a'.repeat(40)}`;

  assert.equal(walletAddressSchema.parse(address), address);
});

test('walletAddressSchema rejects malformed wallet input', () => {
  assert.throws(() => walletAddressSchema.parse('0x123'));
  assert.throws(() => walletAddressSchema.parse('<script>alert(1)</script>'));
});

test('transactionHashSchema validates 64-byte transaction hashes', () => {
  const hash = `0x${'f'.repeat(64)}`;

  assert.equal(transactionHashSchema.parse(hash), hash);
});

test('countSchema validates route count behavior', () => {
  assert.equal(countSchema.parse('10'), 10);
  assert.throws(() => countSchema.parse('101'));
  assert.throws(() => countSchema.parse('0'));
});
