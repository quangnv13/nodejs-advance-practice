const puppeteer = require('puppeteer');
test('Adds two numbers', () => {
    const sum = 1 + 2;
    expect(sum).toEqual(3);
});

test('Can run a browser', async () => {
    const browser = await puppeteer.launch({headless:false});
    const page =await browser.newPage();

})