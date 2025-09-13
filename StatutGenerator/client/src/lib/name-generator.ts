export const frenchNames = [
  'Marie Dubois', 'Jean Martin', 'Sophie Laurent', 'Pierre Moreau', 'Claire Petit',
  'Antoine Durand', 'Isabelle Simon', 'François Michel', 'Nathalie Garcia', 'Philippe Roux',
  'Catherine Bernard', 'Julien Lefebvre', 'Sandrine Rousseau', 'Stéphane Vincent', 'Valérie Morel',
  'Thomas Leroy', 'Céline Fournier', 'Nicolas Girard', 'Aurélie Bonnet', 'David Lambert',
  'Caroline Dupont', 'Alexandre Martin', 'Emilie Robert', 'Maxime Petit', 'Laure Durand'
];

export const creoleNames = [
  'Marie-Claire Joseph', 'Jean-Baptiste Pierre', 'Roseline François', 'Wilderne Jean',
  'Fabiola Auguste', 'Peterson Charles', 'Mirlande Moïse', 'Richardson Duperval',
  'Ketty Belizaire', 'Frantz Alexandre', 'Darline Guillaume', 'James Estimé',
  'Wadley Désir', 'Yolette Azor', 'Bernadel Saint-Vil', 'Daphnée Thermitus',
  'Wesly Toussaint', 'Micheline Casseus', 'Ronald Jean-Louis', 'Ketsia Paultre'
];

export const internationalNames = [
  'Emily Johnson', 'Michael Chen', 'Sofia Rodriguez', 'Ahmed Hassan', 'Anna Kowalski',
  'Carlos Silva', 'Priya Patel', 'Alessandro Rossi', 'Fatima Al-Zahra', 'Hans Mueller',
  'Yuki Tanaka', 'Grace Okonkwo', 'Vladimir Petrov', 'Lucia Fernandez', 'Raj Kumar'
];

export function getNamesByType(type: string): string[] {
  switch (type) {
    case 'french':
      return frenchNames;
    case 'creole':
      return creoleNames;
    case 'international':
      return internationalNames;
    case 'mixed':
      return [...frenchNames, ...creoleNames, ...internationalNames];
    default:
      return frenchNames;
  }
}
