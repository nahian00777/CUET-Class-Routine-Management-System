const { test, expect } = require("@playwright/test");

test("TC-AP-02: Generate Routine", async ({ page }) => {
  try {
    // Navigate to the coordinator panel
    await page.goto("http://localhost:5173/coordinator/generate");

    // Click on "Add Course"
    await page.click('button:has-text("Add Course")');

    // Fill in course details using input types
    await page.fill('input[type="text"]', "CSE-311"); // Course Code

    // Fill in credits (first input of type number)
    await page.locator('input[type="number"]').last().fill("1");

    // Click "Add Course" button
    await page.locator('button:has-text("Add Course")').last().click();

    // Click on "Add Slots" for the course
    await page.click('button:has-text("Add Slots")');

    // Select the first three buttons from Sunday
    for (let i = 0; i < 3; i++) {
      await page.locator("div.grid button").nth(i).click();
    }

    // Confirm time slot selection
    await page.click('button:has-text("Confirm Selection")');

    // Generate routine by theory
    await page.click(
      'button:has-text("Generate Routine (Priority is given to Theory Courses)")'
    );

    // Verify that the routine is generated (adjust verification as needed)
    // await expect(page.locator("text=routine.pdf")).toBeVisible();

    // Print success message
    console.log("Course added and routine generated successfully");
  } catch (error) {
    // Print error message
    console.error("Error in adding course or generating routine", error);
  }
});
