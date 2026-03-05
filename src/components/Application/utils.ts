import jsPDF from "jspdf";

interface DownloadCoverLetterPDFParams {
  content: string;
  companyName: string;
  version: number;
}

export function downloadCoverLetterPDF({
  content,
  companyName,
  version,
}: DownloadCoverLetterPDFParams): void {
  const doc = new jsPDF("p", "in", "letter");
  const margin = 1;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 0.22;

  doc.setFont("helvetica");
  doc.setFontSize(11);

  const paragraphs = content.split("\n");
  let y = margin;

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      y += lineHeight;
      continue;
    }
    const lines = doc.splitTextToSize(paragraph.trim(), maxWidth);
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  const filename = `cover-letter-${(companyName || "company").toLowerCase().replace(/\s+/g, "-")}-v${version}.pdf`;
  doc.save(filename);
}
