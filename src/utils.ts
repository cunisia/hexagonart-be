// min and max included 
export const randomIntFromInterval = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

export const between = (x: number, min: number, max: number) => x >= min && x <= max