import { Page, Locator } from '@playwright/test';

export class FinishGoodsStockPage {
    private readonly page: Page;

    // ==========================================
    // CENTRALIZED LOCATORS DECLARATIONS
    // ==========================================
    private readonly homeMenuIcon: Locator;
    private readonly inventoryMenu: Locator;
    private readonly productsSubMenu: Locator;
    private readonly productsLink: Locator;
    private readonly groupByFilterButton: Locator;
    private readonly productCategoryCheckbox: Locator;
    private readonly finishedGoodsGroupText: Locator;

    constructor(page: Page) {
        this.page = page;

        // ==========================================
        // ELEMENT MAPPINGS
        // ==========================================
        this.homeMenuIcon = page.getByTitle('Home Menu');
        this.inventoryMenu = page.getByRole('menuitem', { name: 'Inventory' });
        this.productsSubMenu = page.getByRole('button', { name: 'Products' });
        this.productsLink = page.getByRole('menuitem', { name: 'Products' });
        
        // Target blank filter icon button using nth(5) as specified
        this.groupByFilterButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(5);
        
        this.productCategoryCheckbox = page.getByRole('menuitemcheckbox', { name: 'Product Category' });
        
        // Target using regex to ensure compatibility if count changes dynamically
        this.finishedGoodsGroupText = page.getByText(/FINISHED GOODS/i);
    }

    // ==========================================
    // ACTIONS AND WORKFLOW METHODS
    // ==========================================
    async navigateToInventoryProducts() {
        await this.homeMenuIcon.click();
        await this.inventoryMenu.click();
        await this.page.waitForTimeout(500); // UI stability buffer
        await this.productsSubMenu.click();
        await this.productsLink.click();
        
    }

    async groupByProductCategory() {
        await this.groupByFilterButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.groupByFilterButton.click();
        await this.productCategoryCheckbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.productCategoryCheckbox.click();
        await this.page.waitForTimeout(1000); // Wait for Odoo grid re-ordering
    }

    async clickFinishedGoodsCategory() {
        await this.finishedGoodsGroupText.first().scrollIntoViewIfNeeded();
        await this.finishedGoodsGroupText.first().click();
        await this.page.waitForTimeout(1000);
    }
}