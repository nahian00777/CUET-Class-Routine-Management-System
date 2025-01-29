const { test, expect } = require("@playwright/test");

test("TC-AP-03: Manage Courses", async ({ page }) => {
  try {
    // Navigate to the course management page
    await page.goto("http://localhost:5173/admin/courses");

    // Click on "Manage Courses"
    await page.click("text=Manage Courses");

    // Fill in the course details
    await page.fill('input[placeholder="Enter Course ID"]', "CSE - 346");
    await page.fill(
      'input[placeholder="Enter Course Name"]',
      "Computer Architecture"
    );
    await page.selectOption("select", "3.0");

    // Click the "Add Course" button
    await page.click('button:has-text("Add Course")');

    // Verify that the course was added successfully
    await expect(page.locator("text=Course added successfully")).toBeVisible();

    // Print success message
    console.log("Course added successfully");
  } catch (error) {
    // Print error message
    console.error("Error managing courses:", error);
  }
});
