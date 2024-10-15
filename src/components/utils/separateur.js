function separateNumber(number) {
    // Vérifier si le nombre est un entier positif
    if (number >= 0) {
      // Convertir le nombre en chaîne de caractères
      var numberString = number.toString();
  
      // Séparer les chiffres en centaines
      var separatedNumber = '';
      for (var i = numberString.length - 1; i >= 0; i--) {
        separatedNumber = numberString.charAt(i) + separatedNumber;
        if (i > 0 && (numberString.length - i) % 3 === 0) {
          separatedNumber = ' ' + separatedNumber;
        }
      }
  
      return separatedNumber;
    } else {
      return 'Veuillez fournir un entier.';
    }
}
export default separateNumber;