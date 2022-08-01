const calculateBmi = (heightInCm: number, weightInKg: number) => {
  const heightInMeter = heightInCm / 100; //100 cm === 1 meter

  //bmi = kg / m^2
  const bmi = Number((weightInKg / Math.pow(heightInMeter, 2)).toFixed(1));
  console.log("bmi :", bmi);

  if (bmi < 16.0) {
    return "Underweight (Severe thinness)";
  } else if (bmi >= 16.0 && bmi <= 16.9) {
    return "Underweight (Moderate thinness)";
  } else if (bmi >= 17.0 && bmi <= 18.4) {
    return "Underweight (Mild thinness)";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal (healthy weight)";
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    return "Overweight (Pre-obese)";
  } else if (bmi >= 30.0 && bmi <= 34.9) {
    return "Obese (Class I)	30.0 – 34.9";
  } else if (bmi >= 35.0 && bmi <= 39.9) {
    return "Obese (Class II)	35.0 – 39.9";
  } else {
    return "Obese (Class III)";
  }
};

const parseArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
  
} catch (error: unknown) {
  if (error instanceof Error) console.log(error.message);
}

export default calculateBmi;