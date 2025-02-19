const { test, expect } = require("@playwright/test");

test("TC-TP-03: Set Time Preferences from Routine", async ({ page }) => {
  try {
    // Navigate to the View Routine page
    await page.goto("http://localhost:5173/teacher/routine");

    // Click on "Set Time Preferences"
    await page.click("text=Set Time Preferences");

    // Click on "Add Time Slot" a few times
    for (let i = 0; i < 2; i++) {
      await page.click('button:has-text("Add Time Slot")');
    }

    // Click "Save Preferences"
    await page.click('button:has-text("Save Preferences")');

    // Print success message
    console.log("Preferences set successfully");
  } catch (error) {
    // Print error message
    console.error("Error setting time preferences:", error);
  }
});
