import * as express from 'express';
export  const  getDatePlusXDays = (x: number)=>{
    const currentDate = new Date();
    const futureDate = new Date();
    
    futureDate.setDate(currentDate.getDate() + x);
    // Obtenez les composants de la date
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const day = futureDate.getDate().toString().padStart(2, '0');

    // Formattez la date comme "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

// Utilisation de la fonction pour obtenir la date actuelle + 5 jours
const dateInFiveDays = getDatePlusXDays(5);
console.log(`La date actuelle plus 5 jours est : ${dateInFiveDays}`);