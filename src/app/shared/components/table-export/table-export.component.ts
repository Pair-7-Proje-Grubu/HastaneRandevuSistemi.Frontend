import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-table-export',
  standalone: true,
  imports: [],
  templateUrl: './table-export.component.html',
  styleUrl: './table-export.component.scss'
})
export class TableExportComponent {
  @ViewChild('dataTable') dataTable!: ElementRef;

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.dataTable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tablo Verileri');
    XLSX.writeFile(wb, 'tablo_verileri.xlsx');
  }

  exportToCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.dataTable.nativeElement);
    const csv: string = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tablo_verileri.csv';
    link.click();
  }

  exportToPNG() {
    html2canvas(this.dataTable.nativeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'tablo_verileri.png';
      link.click();
    });
  }

  printTable() {
    const printContents = this.dataTable.nativeElement.outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  exportToPDF() {
    html2canvas(this.dataTable.nativeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('tablo_verileri.pdf');
    });
  }
}
