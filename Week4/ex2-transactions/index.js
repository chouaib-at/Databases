import { setup } from './setup.js';
import { transferMoney } from './transfer.js';

(async () => {
  await setup();
  await transferMoney(101, 102, 1000, 'transaction');
})();