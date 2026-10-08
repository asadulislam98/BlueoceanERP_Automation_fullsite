import { Page, Locator } from '@playwright/test';

export class SampleSheetToProductionPage {
  private readonly page: Page;
  private readonly databaseLink: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly homeMenuIcon: Locator;
  private readonly boflCustomModuleItem: Locator;
  private readonly sampleButton: Locator;
  private readonly sizeInfoMenuItem: Locator;
  private readonly sampleSheetMenuItem: Locator;
  private readonly newButton: Locator;
  private readonly articleNoInput: Locator;
  private readonly loadSizeButton: Locator;

  // Locators for Size Table Grid & Save Button
  private readonly cellNth1: Locator;
  private readonly row2Col2: Locator;
  private readonly row3Col2: Locator;

  private readonly cellNth2: Locator;
  private readonly row2Col3: Locator;
  private readonly row3Col3: Locator;

  private readonly cellNth3: Locator;
  private readonly row2Col4: Locator;
  private readonly row3Col4: Locator;

  private readonly cellNth4: Locator;
  private readonly row2Col5: Locator;
  private readonly row3Col5: Locator;

  private readonly col7First: Locator;
  private readonly col8First: Locator;

  private readonly saveManuallyButton: Locator;

  // Locators for Sales Order -> Production Sheet Workflow
  private readonly salesMenuItem: Locator;
  private readonly ordersButton: Locator;
  private readonly salesOrderSheetMenuItem: Locator;
  private readonly searchBoxInput: Locator;
  private readonly searchArticleNoOption: Locator;
  private readonly targetRowCheckbox: Locator;
  private readonly firstCell: Locator;
  private readonly productionSheetButton: Locator;
  private readonly draftText: Locator;
  private readonly sampleMaterialButton: Locator;
  private readonly sampleMaterialInput: Locator;
  private readonly searchMoreLink: Locator;
  private readonly searchDropdownToggler: Locator;
  private readonly addCustomFilterMenuItem: Locator;
  private readonly idFilterDropdown: Locator;
  private readonly filterValueInput: Locator;
  private readonly filterAddButton: Locator;
  private readonly brandDataCell: Locator;
  private readonly loadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.databaseLink = page.getByRole('link', { name: 'bofl_live_demo', exact: true });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    
    // Navigation locators post-login
    this.homeMenuIcon = page.getByTitle('Home Menu');
    this.boflCustomModuleItem = page.getByRole('menuitem', { name: 'BOFL Custom Module' }).first();
    
    // Sample, Size Info & Sample Sheet locators
    this.sampleButton = page.getByRole('button', { name: 'Sample' });
    this.sizeInfoMenuItem = page.getByRole('menuitem', { name: 'Size Info' });
    this.sampleSheetMenuItem = page.getByRole('menuitem', { name: 'Sample Sheet' });

    // Form action locators
    this.newButton = page.getByRole('button', { name: 'New' });
    this.articleNoInput = page.getByRole('textbox', { name: 'Article No' });
    this.loadSizeButton = page.getByRole('button', { name: /Load Size/i });

    // Size Table Locators
    this.cellNth1 = page.getByRole('cell').nth(1);
    this.row2Col2 = page.locator('tr:nth-child(2) > td:nth-child(2)');
    this.row3Col2 = page.locator('tr:nth-child(3) > td:nth-child(2)');

    this.cellNth2 = page.getByRole('cell').nth(2);
    this.row2Col3 = page.locator('tr:nth-child(2) > td:nth-child(3)');
    this.row3Col3 = page.locator('tr:nth-child(3) > td:nth-child(3)');

    this.cellNth3 = page.getByRole('cell').nth(3);
    this.row2Col4 = page.locator('tr:nth-child(2) > td:nth-child(4)');
    this.row3Col4 = page.locator('tr:nth-child(3) > td:nth-child(4)');

    this.cellNth4 = page.getByRole('cell').nth(4);
    this.row2Col5 = page.locator('tr:nth-child(2) > td:nth-child(5)');
    this.row3Col5 = page.locator('tr:nth-child(3) > td:nth-child(5)');

    this.col7First = page.locator('td:nth-child(7)').first();
    this.col8First = page.locator('td:nth-child(8)').first();

    this.saveManuallyButton = page.getByRole('button', { name: 'Save manually' });

    // Initializing Locators for Sales & Production Sheet
    this.salesMenuItem = page.getByRole('menuitem', { name: 'Sales' });
    this.ordersButton = page.getByRole('button', { name: 'Orders' });
    this.salesOrderSheetMenuItem = page.getByRole('menuitem', { name: 'Sales Order Sheet' });
    this.searchBoxInput = page.getByRole('searchbox', { name: 'Search...' });
    this.searchArticleNoOption = page.getByRole('link', { name: 'Search Article No for:' });
    
    // Checkbox filter targeting class 'form-check-input' directly
    this.targetRowCheckbox = page.locator('input.form-check-input[type="checkbox"]').first();
    
    this.firstCell = page.getByRole('cell').first();
    this.productionSheetButton = page.getByRole('button', { name: /Production Sheet/i });
    
    this.draftText = page.getByText('Draft');
    this.sampleMaterialButton = page.getByRole('button', { name: 'Sample Material' });
    this.sampleMaterialInput = page.getByRole('textbox', { name: 'Sample Material' });
    this.searchMoreLink = page.getByRole('link', { name: 'Search More...' });
    this.searchDropdownToggler = page.locator('.dropdown-toggle.o_searchview_dropdown_toggler');
    this.addCustomFilterMenuItem = page.getByRole('menuitem', { name: 'Add Custom Filter' });
    this.idFilterDropdown = page.locator('div').filter({ hasText: /^ID$/ }).nth(2);
    this.filterValueInput = page.locator('.o_tree_editor_editor.col.ps-0 > .o_input');
    this.filterAddButton = page.getByRole('button', { name: 'Add', exact: true });
    this.brandDataCell = page.locator('.o_data_cell.cursor-pointer.o_field_cell.o_list_many2one');
    this.loadButton = page.getByRole('button', { name: 'Load', exact: true });
  }

  // Fill Email field with autofill/cache clearance
  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  // Fill Password field with autofill/cache clearance
  async fillPassword(password: string) {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  // Click Login button when visible
  async clickLoginBtn() {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  // Re-usable common login workflow method
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginBtn();
  }

  // Navigate to BOFL Custom Module after login
  async navigateToBoflCustomModule() {
    await this.homeMenuIcon.waitFor({ state: 'visible' });
    await this.homeMenuIcon.click();
    
    await this.boflCustomModuleItem.waitFor({ state: 'visible' });
    await this.boflCustomModuleItem.click();
  }

  // Open Sample menu and select Size Info
  async openSizeInfo() {
    await this.sampleButton.waitFor({ state: 'visible' });
    await this.sampleButton.click();

    await this.sizeInfoMenuItem.waitFor({ state: 'visible' });
    await this.sizeInfoMenuItem.click();
  }

  // Open Sample menu and select Sample Sheet
  async openSampleSheet() {
    await this.sampleButton.waitFor({ state: 'visible' });
    await this.sampleButton.click();

    await this.sampleSheetMenuItem.waitFor({ state: 'visible' });
    await this.sampleSheetMenuItem.click();
  }

  // Click on the New button
  async clickNewButton() {
    await this.newButton.waitFor({ state: 'visible' });
    await this.newButton.click();
  }

  // Fill Article No input field
  async fillArticleNo(articleNo: string) {
    await this.articleNoInput.waitFor({ state: 'visible' });
    await this.articleNoInput.clear();
    await this.articleNoInput.fill(articleNo);
  }

  // Click Load Size button
  async clickLoadSizeButton() {
    await this.loadSizeButton.waitFor({ state: 'visible' });
    await this.loadSizeButton.click();
  }

  // Helper method: Cell-e click kore type korar jonno
  private async clickAndType(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    
    const inputInside = locator.locator('input');
    if (await inputInside.count() > 0) {
      await inputInside.fill(text);
    } else {
      await this.page.keyboard.type(text);
    }
  }

  // Fill Size Grid Details
  async fillSizeGridDetails() {
    // Group 1: 42
    await this.clickAndType(this.cellNth1, '42');
    await this.clickAndType(this.row2Col2, '42');
    await this.clickAndType(this.row3Col2, '42');

    // Group 2: 36
    await this.clickAndType(this.cellNth2, '36');
    await this.clickAndType(this.row2Col3, '36');
    await this.clickAndType(this.row3Col3, '36');

    // Group 3: 32*32.5*33
    await this.clickAndType(this.cellNth3, '32*32.5*33');
    await this.clickAndType(this.row2Col4, '32*32.5*33');
    await this.clickAndType(this.row3Col4, '32*32.5*33');

    // Group 4: 32*32.5*33
    await this.clickAndType(this.cellNth4, '32*32.5*33');
    await this.clickAndType(this.row2Col5, '32*32.5*33');
    await this.clickAndType(this.row3Col5, '32*32.5*33');

    // Group 5: Quantity/Ratio inputs
    await this.clickAndType(this.col7First, '8');
    await this.clickAndType(this.col8First, '2');
  }

  // Click Save Manually Button
  async clickSaveManuallyButton() {
    await this.saveManuallyButton.waitFor({ state: 'visible' });
    await this.saveManuallyButton.click();
  }

  // Complete end workflow step: Sample -> Sample Sheet -> New -> Fill Article No -> Save manually
  async completeSampleSheetWorkflow(articleNo: string) {
    await this.openSampleSheet();
    await this.clickNewButton();
    await this.fillArticleNo(articleNo);
    await this.clickSaveManuallyButton();
  }

  // Workflow: Sales Order Sheet to Production Sheet
  async completeSalesOrderToProductionWorkflow(articleNo: string) {
    // 1. Click home menu icon
    await this.homeMenuIcon.waitFor({ state: 'visible' });
    await this.homeMenuIcon.click();
    await this.page.pause(); // Pause for debugging and verification

    // 2. Click on the Sales module
    await this.salesMenuItem.waitFor({ state: 'visible' });
    await this.salesMenuItem.click(); 

    // 3. Click on the Orders module
    await this.ordersButton.waitFor({ state: 'visible' });
    await this.ordersButton.click();

    // 4. Click on the sales order sheet
    await this.salesOrderSheetMenuItem.waitFor({ state: 'visible' });
    await this.salesOrderSheetMenuItem.click();

    // 5. Fill searchbox with article_no.json value
    await this.searchBoxInput.waitFor({ state: 'visible' });
    await this.searchBoxInput.fill(articleNo);

    // 6. Click on the search article no link
    await this.searchArticleNoOption.waitFor({ state: 'visible' });
    await this.searchArticleNoOption.click();

    // 7. Target row checkbox using class 'form-check-input'
    await this.targetRowCheckbox.waitFor({ state: 'visible' });
    await this.targetRowCheckbox.check({ force: true });

    // 8. Click cell (REMOVED - cell click caused row state toggle & button loss)
    // await this.firstCell.waitFor({ state: 'visible' });
    // await this.firstCell.click();

    // 9. Click on the production sheet button
    await this.productionSheetButton.waitFor({ state: 'visible' });
    await this.productionSheetButton.click();

    // 10. Click on Draft
    await this.draftText.waitFor({ state: 'visible' });
    await this.draftText.click();

    // 11. Click on Sample Material button
    await this.sampleMaterialButton.waitFor({ state: 'visible' });
    await this.sampleMaterialButton.click();

    // 12. Click on Sample Material input
    await this.sampleMaterialInput.waitFor({ state: 'visible' });
    await this.sampleMaterialInput.click();

    // 13. Click on Search More link
    await this.searchMoreLink.waitFor({ state: 'visible' });
    await this.searchMoreLink.click();

    // 14. Click dropdown toggler
    await this.searchDropdownToggler.waitFor({ state: 'visible' });
    await this.searchDropdownToggler.click();

    // 15. Click Add Custom Filter
    await this.addCustomFilterMenuItem.waitFor({ state: 'visible' });
    await this.addCustomFilterMenuItem.click();

    // 16. Filter by ID dropdown
    await this.idFilterDropdown.waitFor({ state: 'visible' });
    await this.idFilterDropdown.click();

    // 16.1. Searchbox-e "article" exact type hobe
    const filterSearchBox = this.page.getByRole('textbox', { name: 'Search...' });
    await filterSearchBox.waitFor({ state: 'visible' });
    await filterSearchBox.fill('article');

    // 16.2. "Article No" button-e click korbe
    const articleNoOptionButton = this.page.getByRole('button', { name: 'Article No' });
    await articleNoOptionButton.waitFor({ state: 'visible' });
    await articleNoOptionButton.click();

    // 17. Fill article_no into filter input
    await this.filterValueInput.waitFor({ state: 'visible' });
    await this.filterValueInput.fill(articleNo);

    // 18. Click Add button forcefully
    await this.filterAddButton.waitFor({ state: 'visible' });
    await this.filterAddButton.click({ force: true });

    // 19. Click on the brand cell
    await this.brandDataCell.waitFor({ state: 'visible' });
    await this.brandDataCell.click();

    // 20. Click on Load button
    await this.loadButton.waitFor({ state: 'visible' });
    await this.loadButton.click();
  }
}