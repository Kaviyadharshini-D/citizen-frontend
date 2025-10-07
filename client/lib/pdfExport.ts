import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  format?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
}

export const exportDashboardToPDF = async (
  elementId: string,
  options: PDFExportOptions = {},
): Promise<void> => {
  const {
    filename = "dashboard-report.pdf",
    quality = 0.98,
    scale = 2,
    format = "a4",
    orientation = "portrait",
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate PDF dimensions
    const imgWidth = format === "a4" ? 210 : format === "letter" ? 216 : 216;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = orientation === "portrait" ? 297 : 210;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);

    // If content fits in one page
    if (heightLeft <= pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages
      while (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        if (heightLeft > 0) {
          pdf.addPage();
          position -= pageHeight;
        }
      }
    }

    // Add header with timestamp
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on: ${timestamp}`, 10, 10);

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};

export const exportAllTabsToPDF = async (
  tabElements: { id: string; name: string }[],
  options: PDFExportOptions = {},
): Promise<void> => {
  const {
    filename = "complete-dashboard-report.pdf",
    quality = 0.98,
    scale = 2,
    format = "a4",
    orientation = "portrait",
  } = options;

  try {
    // Calculate PDF dimensions
    const imgWidth = format === "a4" ? 210 : format === "letter" ? 216 : 216;
    const pageHeight = orientation === "portrait" ? 297 : 210;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    let isFirstPage = true;

    for (const tab of tabElements) {
      const element = document.getElementById(tab.id);
      if (!element) {
        console.warn(`Element with id "${tab.id}" not found, skipping...`);
        continue;
      }

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", quality);

      // Add new page for each tab (except first)
      if (!isFirstPage) {
        pdf.addPage();
      }

      // Add tab title
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(tab.name, 10, 20);

      // Add timestamp on first page only
      if (isFirstPage) {
        const timestamp = new Date().toLocaleString();
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Generated on: ${timestamp}`, 10, 10);
      }

      let heightLeft = imgHeight;
      let position = 30; // Start below the title

      // If content fits in remaining page space
      if (heightLeft <= pageHeight - 30) {
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      } else {
        // Multiple pages for this tab
        while (heightLeft > 0) {
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight - position;

          if (heightLeft > 0) {
            pdf.addPage();
            position = 10; // Reset position for new page
          }
        }
      }

      isFirstPage = false;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate complete dashboard PDF report");
  }
};
