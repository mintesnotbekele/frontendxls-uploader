import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';
export function printTable(newVal: any) {
 newVal = newVal.filter(function (el: any) {
    return el.roles[0].name === "user";
       });
  const arr: any = [];
  console.log(newVal);
  Object.keys(newVal).forEach((key) => {
    arr.push([
      newVal[key].firstName,
      newVal[key].lastName,
      newVal[key].grade,
      newVal[key].phoneNumber,
    ]);
  });

  const doc = new jsPDF('l', 'mm', 'a4');

  const head = [
    [
      'First Name',
      'Last Name',
      'Grade',
      'Phone Number',
    ],
  ];
  const data = arr;
  autoTable(doc, {
    head: head,
    body: data,
    didDrawCell: (data: any) => {},
  });
  const today = new Date();
  doc.save(today + '.pdf');
}
