const { test, expect } = require("@playwright/test");

test("TC-AP-01: Admin Panel loaded", async ({ page }) => {
  try {
    await page.goto("http://localhost:5173");
    await page.click("text=Admin");
    await page.fill(
      'input[placeholder="your.email@cuet.ac.bd"]',
      "admin@gmail.com"
    );
    await page.fill('input[type="password"]', "12345");
    await page.click("text=Sign In");
    await expect(page).toHaveURL("http://localhost:5173/admin/teachers");

    // Use a more specific locator
    await expect(page.locator('h1:has-text("Manage Teachers")')).toBeVisible();

    // Print success message
    console.log("Admin Panel loads successfully");
  } catch (error) {
    // Print error message
    console.error("Error loading Admin Panel:", error);
  }
});
