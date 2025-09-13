import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateNamesSchema } from "@shared/schema";
import type { GeneratedName } from "@shared/schema";

const frenchNames = [
  'Marie Dubois', 'Jean Martin', 'Sophie Laurent', 'Pierre Moreau', 'Claire Petit',
  'Antoine Durand', 'Isabelle Simon', 'François Michel', 'Nathalie Garcia', 'Philippe Roux',
  'Catherine Bernard', 'Julien Lefebvre', 'Sandrine Rousseau', 'Stéphane Vincent', 'Valérie Morel',
  'Thomas Leroy', 'Céline Fournier', 'Nicolas Girard', 'Aurélie Bonnet', 'David Lambert',
  'Caroline Dupont', 'Alexandre Martin', 'Emilie Robert', 'Maxime Petit', 'Laure Durand'
];

const creoleNames = [
  'Marie-Claire Joseph', 'Jean-Baptiste Pierre', 'Roseline François', 'Wilderne Jean',
  'Fabiola Auguste', 'Peterson Charles', 'Mirlande Moïse', 'Richardson Duperval',
  'Ketty Belizaire', 'Frantz Alexandre', 'Darline Guillaume', 'James Estimé',
  'Wadley Désir', 'Yolette Azor', 'Bernadel Saint-Vil', 'Daphnée Thermitus',
  'Wesly Toussaint', 'Micheline Casseus', 'Ronald Jean-Louis', 'Ketsia Paultre'
];

const internationalNames = [
  'Emily Johnson', 'Michael Chen', 'Sofia Rodriguez', 'Ahmed Hassan', 'Anna Kowalski',
  'Carlos Silva', 'Priya Patel', 'Alessandro Rossi', 'Fatima Al-Zahra', 'Hans Mueller',
  'Yuki Tanaka', 'Grace Okonkwo', 'Vladimir Petrov', 'Lucia Fernandez', 'Raj Kumar'
];

const reactions = ['❤️', '👍', '😂', '😮', '😢', '😡', '👏', '🔥', '💯'];
const timeOptions = ['il y a 2 min', 'il y a 5 min', 'il y a 12 min', 'il y a 18 min', 'il y a 25 min', 'il y a 1h'];

const avatars = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face'
];

function getNamesByType(type: string): string[] {
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

function generateRandomNames(count: number, type: string): GeneratedName[] {
  const namesList = getNamesByType(type);
  const selectedNames: GeneratedName[] = [];
  const usedNames = new Set<string>();

  while (selectedNames.length < count && usedNames.size < namesList.length) {
    const randomName = namesList[Math.floor(Math.random() * namesList.length)];
    
    if (!usedNames.has(randomName)) {
      usedNames.add(randomName);
      
      const hasReacted = Math.random() > 0.4; // 60% chance of reaction
      
      selectedNames.push({
        name: randomName,
        hasReacted,
        reaction: hasReacted ? reactions[Math.floor(Math.random() * reactions.length)] : '',
        timeAgo: timeOptions[Math.floor(Math.random() * timeOptions.length)],
        isOnline: Math.random() > 0.3, // 70% chance of being online
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      });
    }
  }

  return selectedNames;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/generate-names", async (req, res) => {
    try {
      const { count, type } = generateNamesSchema.parse(req.body);
      const names = generateRandomNames(count, type);
      res.json({ names });
    } catch (error) {
      res.status(400).json({ error: "Invalid request parameters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
