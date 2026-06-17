import { jsPDF } from 'jspdf'

export interface CertificateData {
  fullName: string
  examScore: number
  completedDate: string // already formatted for display, e.g. "June 15, 2026"
  certId: string
}

const NAVY: [number, number, number] = [15, 32, 64]
const AMBER: [number, number, number] = [245, 158, 11]
const SLATE: [number, number, number] = [100, 116, 139]
const LIGHT_SLATE: [number, number, number] = [148, 163, 184]
const BODY: [number, number, number] = [71, 85, 105]

// Landscape US Letter in points (792 x 612), matching the on-screen
// certificate's proportions and color palette (navy / amber, Sora + serif).
export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const centerX = pageWidth / 2

  // Background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Outer navy border
  doc.setDrawColor(...NAVY)
  doc.setLineWidth(5)
  doc.rect(18, 18, pageWidth - 36, pageHeight - 36)

  // Amber corner accents
  const cs = 26
  doc.setDrawColor(...AMBER)
  doc.setLineWidth(2.5)
  const corners: [number, number][] = [
    [34, 34],
    [pageWidth - 34 - cs, 34],
    [34, pageHeight - 34 - cs],
    [pageWidth - 34 - cs, pageHeight - 34 - cs],
  ]
  corners.forEach(([x, y]) => doc.rect(x, y, cs, cs))

  // Brand
  doc.setTextColor(...AMBER)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('CLEARPASS DRIVE', centerX, 84, { align: 'center' })

  doc.setTextColor(...SLATE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('CALIFORNIA TRAFFIC VIOLATOR SCHOOL  ·  DMV LICENSE PENDING', centerX, 101, { align: 'center' })

  // "This certifies that"
  doc.setTextColor(...BODY)
  doc.setFont('times', 'normal')
  doc.setFontSize(15)
  doc.text('This certifies that', centerX, 148, { align: 'center' })

  // Student name + underline — auto-shrink so unusually long names never
  // run into the corner accents.
  doc.setTextColor(...NAVY)
  doc.setFont('times', 'bold')
  let nameFontSize = 34
  const maxNameWidth = pageWidth - 220
  doc.setFontSize(nameFontSize)
  while (doc.getTextWidth(data.fullName) > maxNameWidth && nameFontSize > 18) {
    nameFontSize -= 1
    doc.setFontSize(nameFontSize)
  }
  doc.text(data.fullName, centerX, 192, { align: 'center' })
  const nameHalfWidth = Math.max(doc.getTextWidth(data.fullName) / 2 + 20, 160)
  doc.setDrawColor(...AMBER)
  doc.setLineWidth(1.5)
  doc.line(centerX - nameHalfWidth, 202, centerX + nameHalfWidth, 202)

  // "has successfully completed..."
  doc.setTextColor(...BODY)
  doc.setFont('times', 'normal')
  doc.setFontSize(15)
  doc.text('has successfully completed the', centerX, 230, { align: 'center' })

  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text('California Traffic Violator School Course', centerX, 256, { align: 'center' })

  doc.setTextColor(...SLATE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('California Vehicle Code — 10-Chapter Curriculum  ·  OL 613 Compliant', centerX, 274, { align: 'center' })

  // Stat row: score / date / cert id
  const statY = 340
  const statLabelY = 360
  const stats = [
    { value: `${data.examScore}%`, label: 'FINAL EXAM SCORE', x: centerX - 210 },
    { value: data.completedDate, label: 'DATE COMPLETED', x: centerX },
    { value: data.certId, label: 'CERTIFICATE ID', x: centerX + 210 },
  ]
  stats.forEach(stat => {
    doc.setTextColor(...NAVY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(stat.value, stat.x, statY, { align: 'center' })
    doc.setTextColor(...LIGHT_SLATE)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(stat.label, stat.x, statLabelY, { align: 'center' })
  })

  // Divider above signatures
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(1)
  doc.line(centerX - 280, 396, centerX + 280, 396)

  // Signature lines
  const sigY = 444
  const sig1X = centerX - 150
  const sig2X = centerX + 150
  doc.setDrawColor(...NAVY)
  doc.setLineWidth(1)
  doc.line(sig1X - 95, sigY, sig1X + 95, sigY)
  doc.line(sig2X - 95, sigY, sig2X + 95, sigY)

  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Maurice Ndole', sig1X, sigY + 18, { align: 'center' })
  doc.text('Ndole Media Group', sig2X, sigY + 18, { align: 'center' })

  doc.setTextColor(...LIGHT_SLATE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.text('Director, Ndole Media Group', sig1X, sigY + 32, { align: 'center' })
  doc.text('TVS License Pending', sig2X, sigY + 32, { align: 'center' })

  doc.setTextColor(...LIGHT_SLATE)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text('Ndole Media Group  ·  Fresno County, California  ·  www.clearpassdrive.com', centerX, pageHeight - 38, { align: 'center' })

  return doc
}

export function buildCertId(userId: string, year: number): string {
  return `CPD-${userId.slice(0, 8).toUpperCase()}-${year}`
}
