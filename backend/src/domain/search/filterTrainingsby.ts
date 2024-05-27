import { TrainingResult } from "../training/TrainingResult";

export async function filterByCost (trainings: TrainingResult[], maxCost: number) {
  const newTrainings = trainings.filter(async (training) => {
    if (training.totalCost) return training.totalCost <= maxCost;
  });

  console.log(newTrainings.length)

  return newTrainings;
}