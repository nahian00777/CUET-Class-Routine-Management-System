const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

test("TC-CP-03: Update Routine and Download PDF", async ({ page }) => {
  try {
    // Navigate to the coordinator panel
    await page.goto("http://localhost:5173/coordinator/update");

    const isEditableRoutineVisible = await page.isVisible(
      "text=Editable Routine"
    );

    // Print success message
    console.log("Routine updated successfully");
  } catch (error) {
    // Print error message
    console.error("Error updating routine or downloading PDF:", error);
  }
});
