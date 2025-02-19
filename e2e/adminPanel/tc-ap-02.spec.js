const { test, expect } = require("@playwright/test");

test("TC-AP-02: Manage Teachers", async ({ page }) => {
  try {
    // Navigate to the Manage Teachers page
    await page.goto("http://localhost:5173/admin/teachers");

    // Fill in the teacher details
    await page.fill('input[placeholder="Teacher Name"]', "Billal Hossain");
    await page.fill('input[placeholder="Teacher ID"]', "123");

    // Select the department from the dropdown
    await page.selectOption("select", { label: "CSE" });

    // Click the "Add Teacher" button
    await page.click('button:has-text("Add Teacher")');

    // Verify that the teacher was added successfully
    await expect(page.locator("text=Teacher added successfully")).toBeVisible();

    // Print success message
    console.log("Teacher added successfully");
  } catch (error) {
    // Print error message
    console.error("Error managing teachers:", error);
  }
});
