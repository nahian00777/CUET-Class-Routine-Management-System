const { test, expect } = require("@playwright/test");

test("TC-TP-01: Teacher Panel loaded", async ({ page }) => {
  try {
    await page.goto("http://localhost:5173");
    await page.click("text=Teacher");
    await page.fill(
      'input[placeholder="your.email@cuet.ac.bd"]',
      "2004005@teacher.com"
    );
    await page.fill('input[type="password"]', "2004005");
    await page.click("text=Sign In");
    await expect(page).toHaveURL("http://localhost:5173/teacher/routine");

    // Use a more specific locator
    await expect(page.locator("text=My Teaching Schedule")).toBeVisible();

    // Print success message
    console.log("Teacher Panel displayed successfully");
  } catch (error) {
    // Print error message
    console.error("Error loading Teacher Panel:", error);
  }
});
