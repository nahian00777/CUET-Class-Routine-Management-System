import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const findCourse = async (courseId) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/courses/getCourseById",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }), // Send courseId in the request body
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }

    const course = await response.json();
    if (!course) {
      throw new Error("Course not found");
    }
    // console.log("Course fetched successfully:", course.data._id);
    // console.log("Course fetched successfully:", course._id);
    return course.data._id; // Return the course data
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

const storeScheduleData = async (
  course,
  timeSlots,
  department,
  section,
  level,
  term
) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/schedules/setSchedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          timeSlots,
          department,
          section,
          level,
          term,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to store schedule data");
    }

    const result = await response.json();
    console.log("Schedule stored successfully:", result);
  } catch (error) {
    console.error("Error storing schedule data:", error);
  }
};

// Define available days and time slots
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const allTimeSlots = [
  "8:10-9:00",
  "9:00-9:50",
  "9:50-10:40",
  "11:00-11:50",
  "11:50-12:40",
  "12:40-1:30",
  "2:30-3:20",
  "3:20-4:10",
  "4:10-5:00",
];

// Define theory courses with their preferred time slots
export const courses = [
  {
    course_code: "111",
    credits: 1,
    preferred_slots: [
      ["Tuesday", "9:00-9:50"],
      ["Sunday", "11:00-11:50"],
      ["Monday", "11:50-12:40"],
      ["Wednesday", "9:50-10:40"],
    ],
  },
  {
    course_code: "222",
    credits: 1,
    preferred_slots: [
      ["Wednesday", "11:00-11:50"],
      ["Thursday", "9:00-9:50"],
      ["Sunday", "9:00-9:50"],
      ["Monday", "9:50-10:40"],
    ],
  },
];

// Define lab courses with their preferred time slots
export const labCourses = [
  {
    course_code: "44",
    credits: 1.5,
    preferred_slots: [
      ["Sunday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
      ["Monday", ["11:00-11:50", "11:50-12:40", "12:40-1:30"]],
      ["Monday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
    ],
  },
  {
    course_code: "55",
    credits: 0.75,
    preferred_slots: [
      ["Wednesday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
      ["Wednesday", ["11:00-11:50", "11:50-12:40", "12:40-1:30"]],
      ["Thursday", ["2:30-3:20", "3:20-4:10", "4:10-5:00"]],
    ],
  },
];

// Function to generate routines for multiple sections
export const generateRoutine = (courses, labCourses, numSections) => {
  const routine = {};
  for (let i = 0; i < numSections; i++) {
    routine[`Section ${String.fromCharCode(65 + i)}`] = [];
  }

  // Track used slots for each section
  const usedSlots = {};

  // Track used slots globally across all sections
  const globalUsedSlots = {};

  // Initialize usedSlots and globalUsedSlots
  for (const section in routine) {
    usedSlots[section] = {};

    for (const day of days) {
      usedSlots[section][day] = new Set();
    }
  }

  for (const day of days) {
    globalUsedSlots[day] = new Set();
  }

  // Define valid lab slot combinations
  const validLabCombinations = [
    ["8:10-9:00", "9:00-9:50", "9:50-10:40"],
    ["11:00-11:50", "11:50-12:40", "12:40-1:30"],
    ["2:30-3:20", "3:20-4:10", "4:10-5:00"],
  ];

  // Schedule theory courses (unchanged)
  for (const section in routine) {
    for (const course of courses) {
      const { course_code, credits, preferred_slots } = course;
      let slotsAssigned = 0;

      // Track if the course is already scheduled on a particular day
      const courseScheduledOnDay = {};

      for (const [day, timeSlot] of preferred_slots) {
        if (slotsAssigned >= credits) break;

        // Check if the course is already scheduled on this day
        if (courseScheduledOnDay[day]) continue;

        // Check if the slot is available in both the section and globally
        if (
          !usedSlots[section][day].has(timeSlot) &&
          !globalUsedSlots[day].has(timeSlot)
        ) {
          routine[section].push([course_code, day, timeSlot]);
          usedSlots[section][day].add(timeSlot);
          globalUsedSlots[day].add(timeSlot); // Mark the slot as used globally
          slotsAssigned++;
          courseScheduledOnDay[day] = true; // Mark the course as scheduled on this day
        }
      }
    }
  }

  // Schedule lab courses
  for (const section in routine) {
    // Track if a lab course is already scheduled for the section in the week
    const labCourseScheduledForSection = new Set();

    for (const labCourse of labCourses) {
      const { course_code, preferred_slots } = labCourse;

      // Skip if the lab course is already scheduled for this section
      if (labCourseScheduledForSection.has(course_code)) continue;

      // Track if the lab course is already scheduled on a particular day
      const labCourseScheduledOnDay = {};

      for (const [day, timeSlots] of preferred_slots) {
        // Check if the lab course is already scheduled on this day
        if (labCourseScheduledOnDay[day]) continue;

        // Check if the timeSlots match one of the valid lab combinations
        const validCombination = validLabCombinations.find((combination) =>
          combination.every((slot) => timeSlots.includes(slot))
        );

        // If the timeSlots do not match any valid combination, skip this lab course
        if (!validCombination) continue;

        // Check if all slots in the valid combination are available in the section and globally
        if (
          validCombination.every(
            (slot) => !usedSlots[section][day].has(slot)
          ) &&
          validCombination.every((slot) => !globalUsedSlots[day].has(slot))
        ) {
          let conflict = false;

          // Check for conflicts in other sections
          for (const otherSection in routine) {
            if (otherSection === section) continue;

            for (const [otherCourse, otherDay, otherTimeSlot] of routine[
              otherSection
            ]) {
              if (
                otherDay === day &&
                validCombination.includes(otherTimeSlot)
              ) {
                conflict = true;
                break;
              }
            }

            if (conflict) break;
          }

          if (!conflict) {
            // Assign all three slots of the valid combination to the lab course
            for (const timeSlot of validCombination) {
              routine[section].push([course_code, day, timeSlot]);
              usedSlots[section][day].add(timeSlot);
              globalUsedSlots[day].add(timeSlot); // Mark the slot as used globally
            }

            // Mark the lab course as scheduled on this day and for this section
            labCourseScheduledOnDay[day] = true;
            labCourseScheduledForSection.add(course_code);
            break; // Move to the next lab course
          }
        }
      }
    }
  }

  return routine;
};

// Function to generate PDF of the routine
export const generatePdf = async (routine, fileName = "routine.pdf") => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Define some constants for styling
  const PAGE_WIDTH = 800; // Width of the page
  const PAGE_HEIGHT = 600; // Height of the page
  const TABLE_START_X = 50; // X position where the table starts
  const TABLE_START_Y = 550; // Y position where the table starts
  const ROW_HEIGHT = 15; // Reduced row height for compact tables
  const COLUMN_WIDTH = 60; // Reduced column width for compact tables
  const HEADER_COLOR = rgb(0.9, 0.9, 0.9); // Light gray for headers
  const BORDER_COLOR = rgb(0, 0, 0); // Black for borders
  const TEXT_COLOR = rgb(0, 0, 0); // Black for text
  const TABLE_WIDTH = COLUMN_WIDTH * (allTimeSlots.length + 1); // Total table width
  const TABLE_HEIGHT = ROW_HEIGHT * (days.length + 2); // Total table height (header + rows)

  // Loop through each section and create a new page for it
  // console.log("Routine: ", routine);
  for (const section in routine) {
    console.log(`Processing section: ${section}`); // Debugging log
    const sec = section;
    console.log("Section ID", routine[section]);
    const courseId = routine[section][0][0];
    const day = routine[section][0][1];
    const time = routine[section][0][2];
    const level = "Level 1";
    const term = "Term 1";
    const department = "CSE";
    const [startTime, endTime] = time.split("-");

    // Create a time slot object
    const timeSlots = {
      day: day,
      startTime: startTime,
      endTime: endTime,
    };

    const course = findCourse(courseId);
    const courseData = await course;
    // console.log("Course ID:", courseData);
    // const scheduleData = new Schedule({
    //   course: course, // Ensure this is a valid ObjectId
    //   timeSlots: [timeSlot],
    //   instructor: "Sojib Bhattacharjee", // Replace with actual data
    //   department: department, // Replace with actual data
    //   level: level,
    //   term: term,
    //   section: sec,
    //   room: "3204", // Replace with actual data
    // });
    // console.log(routine[section][0][0]);
    await storeScheduleData(
      courseData,
      timeSlots,
      department,
      section,
      level,
      term
    );
    // console.log(routine[section][0][0]);

    // Create a new page for the current section
    const currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let currentX = TABLE_START_X; // Reset X position for the new page
    let currentY = TABLE_START_Y; // Reset Y position for the new page

    // Draw the section title
    currentPage.drawText(`Class Routine for ${section}`, {
      x: currentX,
      y: currentY,
      size: 12,
      font,
      color: TEXT_COLOR,
    });
    currentY -= 20;

    // Draw table headers
    currentPage.drawRectangle({
      x: currentX - 5,
      y: currentY - ROW_HEIGHT + 5,
      width: TABLE_WIDTH,
      height: ROW_HEIGHT,
      color: HEADER_COLOR,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    // Write "Day" header
    currentPage.drawText("Day", {
      x: currentX,
      y: currentY - 5,
      size: 10,
      font,
      color: TEXT_COLOR,
    });

    // Write time slot headers
    let x = currentX + COLUMN_WIDTH;
    for (const slot of allTimeSlots) {
      currentPage.drawText(slot, {
        x: x + 5,
        y: currentY - 5,
        size: 8,
        font,
        color: TEXT_COLOR,
      });
      x += COLUMN_WIDTH;
    }
    currentY -= ROW_HEIGHT;

    // Draw table rows
    for (const day of days) {
      // Draw row background
      currentPage.drawRectangle({
        x: currentX - 5,
        y: currentY - ROW_HEIGHT + 5,
        width: TABLE_WIDTH,
        height: ROW_HEIGHT,
        color: HEADER_COLOR,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
      });

      // Write the day name
      currentPage.drawText(day, {
        x: currentX,
        y: currentY - 5,
        size: 10,
        font,
        color: TEXT_COLOR,
      });

      // Collect all classes for the current day
      const dayClasses = {};
      for (const [course, classDay, classTimeSlot] of routine[section]) {
        if (classDay === day) {
          if (!dayClasses[course]) {
            dayClasses[course] = [];
          }
          dayClasses[course].push(classTimeSlot);
        }
      }

      // Write class codes for each time slot
      x = currentX + COLUMN_WIDTH;
      let mergedSlots = new Set(); // Track slots that have been merged
      for (let i = 0; i < allTimeSlots.length; i++) {
        const timeSlot = allTimeSlots[i];
        let foundClass = "";
        let colspan = 1;

        // Check if the current slot is part of a lab course
        for (const [course, slots] of Object.entries(dayClasses)) {
          if (slots.includes(timeSlot) && !mergedSlots.has(timeSlot)) {
            // Check if the next two slots are also part of the same lab course
            if (
              slots.includes(allTimeSlots[i + 1]) &&
              slots.includes(allTimeSlots[i + 2])
            ) {
              foundClass = course;
              colspan = 3;
              mergedSlots.add(allTimeSlots[i]);
              mergedSlots.add(allTimeSlots[i + 1]);
              mergedSlots.add(allTimeSlots[i + 2]);
              break;
            }
          }
        }

        // If no lab course, check for regular courses
        if (!foundClass) {
          for (const [course, classDay, classTimeSlot] of routine[section]) {
            if (classDay === day && classTimeSlot === timeSlot) {
              foundClass = course;
              break;
            }
          }
        }

        // Draw cell border
        currentPage.drawRectangle({
          x: x - 5,
          y: currentY - ROW_HEIGHT + 5,
          width: COLUMN_WIDTH * colspan,
          height: ROW_HEIGHT,
          borderColor: BORDER_COLOR,
          borderWidth: 1,
        });

        // Write the class code
        currentPage.drawText(foundClass || "", {
          x: x + 5,
          y: currentY - 5,
          size: 8,
          font,
          color: TEXT_COLOR,
        });

        // Skip the merged slots
        x += COLUMN_WIDTH * colspan;
        i += colspan - 1;
      }
      currentY -= ROW_HEIGHT;
    }
  }

  // Save and download the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
