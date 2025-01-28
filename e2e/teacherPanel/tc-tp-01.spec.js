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
    await expect(page).toHaveURL("http://localhost:5173/teacher/routine");

    // Use a more specific locator
    await expect(
      page.locator('has-text("My Teaching Schedule")')
    ).toBeVisible();

    // Print success message
    console.log("Teacher Panel display successfully");
  } catch (error) {
    // Print error message
    console.error("Error loading Teacher Panel", error);
  }
});
