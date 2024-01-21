import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(): Promise<void> {
  return new Promise((resolve, reject) => { 
    setTimeout(() => resolve(), 10000);
  });
}