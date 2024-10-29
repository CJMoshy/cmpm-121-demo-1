declare module "*jpg";

interface Item {
  name: string;
  cost: number;
  growth_rate: number;
  description: string;
}

interface GameManager {
  count: number;
  growthRate: number;
  initial: number;
  upgradeIncreaseFactor: number;
  availableItems: Item[];
}
