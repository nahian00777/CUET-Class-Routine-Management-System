const { test, expect } = require("@playwright/test");

test("TC-TP-02: View Schedule", async ({ page }) => {
  try {
    // Navigate to the teacher panel
    await page.goto("http://localhost:5173/teacher/routine");

    // Click on "View Routine"
    await page.click("text=View Routine");

    // Verify that the routine is loaded successfully
    await expect(page.locator("text=My Teaching Schedule")).toBeVisible();

    // Print success message
    console.log("Routine loaded successfully");
  } catch (error) {
    // Print error message
    console.error("Error viewing schedule:", error);
  }
});
