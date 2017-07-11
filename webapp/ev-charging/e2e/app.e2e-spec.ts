import { EvChargingPage } from './app.po';

describe('ev-charging App', () => {
  let page: EvChargingPage;

  beforeEach(() => {
    page = new EvChargingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
