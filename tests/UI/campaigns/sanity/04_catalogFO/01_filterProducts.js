require('module-alias/register');
// Using chai
const {expect} = require('chai');
const helper = require('@utils/helpers');
const testContext = require('@utils/testContext');

const baseContext = 'sanity_catalogFO_filterProducts';

// Importing pages
const HomePage = require('@pages/FO/home');
const {Categories} = require('@data/demo/categories');

let browserContext;
let page;
let allProductsNumber = 0;

// creating pages objects in a function
const init = async function () {
  return {
    homePage: new HomePage(page),
  };
};

/*
  Open the FO home page
  Get the product number
  Filter products by a category
  Filter products by a subcategory
 */
describe('Filter Products by categories in Home page', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);
    this.pageObjects = await init();
  });
  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  // Steps
  it('should open the shop page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);
    await this.pageObjects.homePage.goTo(global.FO.URL);
    const result = await this.pageObjects.homePage.isHomePage();
    await expect(result).to.be.true;
  });

  it('should check and get the products number', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'checkNumberOfProducts', baseContext);
    await this.pageObjects.homePage.waitForSelectorAndClick(this.pageObjects.homePage.allProductLink);
    allProductsNumber = await this.pageObjects.homePage.getNumberFromText(this.pageObjects.homePage.totalProducts);
    await expect(allProductsNumber).to.be.above(0);
  });

  it('should filter products by the category "Accessories" and check result', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'FilterProductByCategory', baseContext);
    await this.pageObjects.homePage.goToCategory(Categories.accessories.id);
    const numberOfProducts = await this.pageObjects.homePage.getNumberFromText(this.pageObjects.homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });

  it('should filter products by the subcategory "Stationery" and check result', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'FilterProductBySubCategory', baseContext);
    await this.pageObjects.homePage.goToSubCategory(Categories.accessories.id, Categories.stationery.id);
    const numberOfProducts = await this.pageObjects.homePage.getNumberFromText(this.pageObjects.homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });
});
