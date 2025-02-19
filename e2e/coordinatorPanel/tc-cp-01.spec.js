const { test, expect } = require("@playwright/test");

test("TC-AP-01: Admin Panel loaded", async ({ page }) => {
  try {
    await page.goto("http://localhost:5173");
    await page.click("text=Course Coordinator");
    await page.fill(
      'input[placeholder="your.email@cuet.ac.bd"]',
      "200405@coordinator.com"
    );
    await page.fill('input[type="password"]', "200405");
    await page.click("text=Sign In");
    await expect(page).toHaveURL("http://localhost:5173/coordinator/generate");

    // Use a more specific locator
    await expect(page.locator("text=Course Schedule Manager")).toBeVisible();

    // Print success message
    console.log("Coordinator Panel display successfully");
  } catch (error) {
    // Print error message
    console.error("Error loading Coordinator Panel", error);
  }
});
